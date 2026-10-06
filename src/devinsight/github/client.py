import base64
import asyncio
from typing import Dict, List, Optional
import httpx
from devinsight.config import settings
from devinsight.core.exceptions import (
    GitHubAPIError,
    RateLimitExceededError,
    UserNotFoundError,
    RepositoryNotFoundError,
)
from devinsight.core.logger import logger
from devinsight.github.rate_limiter import RateLimitTracker
from devinsight.schemas.github import (
    GitHubUserProfile,
    GitHubRepository,
    GitHubCommit,
    GitHubPullRequest,
    GitHubIssue,
    GitHubReadme,
    GitHubRateLimit,
)


class GitHubClient:
    """Asynchronous client for interacting with the GitHub REST API."""

    def __init__(
        self,
        token: Optional[str] = None,
        base_url: Optional[str] = None,
        timeout: float = 30.0,
    ):
        self.token = token or settings.github_token
        self.base_url = (base_url or settings.github_api_base_url).rstrip("/")
        self.timeout = timeout
        self.rate_limiter = RateLimitTracker()
        self._client: Optional[httpx.AsyncClient] = None

    def _get_headers(self) -> Dict[str, str]:
        """Construct standard HTTP headers for API requests."""
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DevInsight-AI/0.1.0",
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    async def get_client(self) -> httpx.AsyncClient:
        """Lazy initialization of httpx.AsyncClient."""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                headers=self._get_headers(),
                timeout=self.timeout,
                follow_redirects=True,
            )
        return self._client

    async def close(self):
        """Close HTTP client session."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            self._client = None

    async def __aenter__(self):
        await self.get_client()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[dict] = None,
        retries: int = 3,
    ) -> httpx.Response:
        """Internal helper for API calls with automatic retry and rate limit tracking."""
        client = await self.get_client()
        url = endpoint if endpoint.startswith("http") else f"{self.base_url}{endpoint}"

        if self.rate_limiter.is_exhausted():
            wait_sec = self.rate_limiter.time_until_reset()
            logger.warning(
                f"API rate limit exhausted. Waiting for reset ({int(wait_sec)}s)."
            )
            raise RateLimitExceededError(
                reset_time=int(self.rate_limiter.reset_timestamp),
                message=f"Rate limit exceeded. Resets in {int(wait_sec)}s.",
            )

        for attempt in range(1, retries + 1):
            try:
                response = await client.request(method, url, params=params)
                self.rate_limiter.update_from_headers(response.headers)

                if response.status_code in (403, 429) and "rate limit exceeded" in response.text.lower():
                    wait_sec = self.rate_limiter.time_until_reset()
                    if attempt < retries and wait_sec < 10:
                        await asyncio.sleep(wait_sec + 1)
                        continue
                    raise RateLimitExceededError(
                        reset_time=int(self.rate_limiter.reset_timestamp)
                    )

                if response.status_code == 404:
                    return response

                if response.status_code >= 500:
                    if attempt < retries:
                        await asyncio.sleep(2 ** attempt)
                        continue
                    raise GitHubAPIError(
                        message=f"GitHub server error ({response.status_code})",
                        status_code=response.status_code,
                    )

                response.raise_for_status()
                return response

            except httpx.RequestError as exc:
                if attempt < retries:
                    await asyncio.sleep(2 ** attempt)
                    continue
                raise GitHubAPIError(
                    message=f"Network communication error: {str(exc)}",
                    status_code=500,
                )

        raise GitHubAPIError("Max retries reached for API call.", status_code=500)

    async def get_user_profile(self, username: str) -> GitHubUserProfile:
        """Fetch developer user profile."""
        response = await self._request("GET", f"/users/{username}")
        if response.status_code == 404:
            raise UserNotFoundError(username)

        data = response.json()
        return GitHubUserProfile(
            login=data["login"],
            id=data["id"],
            node_id=data.get("node_id"),
            avatar_url=data.get("avatar_url"),
            html_url=data["html_url"],
            name=data.get("name"),
            company=data.get("company"),
            blog=data.get("blog"),
            location=data.get("location"),
            email=data.get("email"),
            bio=data.get("bio"),
            twitter_username=data.get("twitter_username"),
            public_repos=data.get("public_repos", 0),
            public_gists=data.get("public_gists", 0),
            followers=data.get("followers", 0),
            following=data.get("following", 0),
            created_at=data.get("created_at", ""),
            updated_at=data.get("updated_at", ""),
        )

    async def get_user_repositories(
        self,
        username: str,
        max_repos: int = 50,
        sort: str = "updated",
    ) -> List[GitHubRepository]:
        """Fetch public repositories for a user with pagination handling."""
        repos = []
        page = 1
        per_page = min(max_repos, 100)

        while len(repos) < max_repos:
            response = await self._request(
                "GET",
                f"/users/{username}/repos",
                params={
                    "type": "owner",
                    "sort": sort,
                    "direction": "desc",
                    "per_page": per_page,
                    "page": page,
                },
            )

            if response.status_code == 404:
                raise UserNotFoundError(username)

            data = response.json()
            if not data or not isinstance(data, list):
                break

            for item in data:
                if len(repos) >= max_repos:
                    break
                license_name = (
                    item.get("license", {}).get("name")
                    if isinstance(item.get("license"), dict)
                    else None
                )
                owner_login = item.get("owner", {}).get("login", username)

                repos.append(
                    GitHubRepository(
                        id=item["id"],
                        name=item["name"],
                        full_name=item["full_name"],
                        owner_login=owner_login,
                        html_url=item["html_url"],
                        description=item.get("description"),
                        is_fork=item.get("fork", False),
                        created_at=item.get("created_at"),
                        updated_at=item.get("updated_at"),
                        pushed_at=item.get("pushed_at"),
                        homepage=item.get("homepage"),
                        size=item.get("size", 0),
                        stargazers_count=item.get("stargazers_count", 0),
                        watchers_count=item.get("watchers_count", 0),
                        language=item.get("language"),
                        forks_count=item.get("forks_count", 0),
                        open_issues_count=item.get("open_issues_count", 0),
                        default_branch=item.get("default_branch", "main"),
                        topics=item.get("topics", []),
                        license_name=license_name,
                        has_issues=item.get("has_issues", True),
                        has_projects=item.get("has_projects", True),
                        has_wiki=item.get("has_wiki", True),
                        archived=item.get("archived", False),
                        disabled=item.get("disabled", False),
                    )
                )

            if len(data) < per_page:
                break
            page += 1

        return repos

    async def get_repo_languages(self, owner: str, repo: str) -> Dict[str, int]:
        """Fetch language breakdown (language_name -> bytes) for a repo."""
        response = await self._request("GET", f"/repos/{owner}/{repo}/languages")
        if response.status_code == 404:
            return {}
        return response.json()

    async def get_repo_commits(
        self,
        owner: str,
        repo: str,
        max_commits: int = 30,
    ) -> List[GitHubCommit]:
        """Fetch recent commits for a repository."""
        commits = []
        response = await self._request(
            "GET",
            f"/repos/{owner}/{repo}/commits",
            params={"per_page": min(max_commits, 100)},
        )

        if response.status_code == 404:
            return []

        data = response.json()
        if not isinstance(data, list):
            return []

        for item in data[:max_commits]:
            commit_detail = item.get("commit", {})
            author = commit_detail.get("author", {}) or {}
            committer = commit_detail.get("committer", {}) or {}

            commits.append(
                GitHubCommit(
                    sha=item.get("sha", ""),
                    commit_message=commit_detail.get("message", "").strip(),
                    author_name=author.get("name"),
                    author_email=author.get("email"),
                    commit_date=author.get("date"),
                    repo_full_name=f"{owner}/{repo}",
                    committer_name=committer.get("name"),
                )
            )

        return commits

    async def get_repo_pull_requests(
        self,
        owner: str,
        repo: str,
        max_prs: int = 20,
    ) -> List[GitHubPullRequest]:
        """Fetch pull requests for a repository."""
        prs = []
        response = await self._request(
            "GET",
            f"/repos/{owner}/{repo}/pulls",
            params={"state": "all", "per_page": min(max_prs, 100)},
        )

        if response.status_code == 404:
            return []

        data = response.json()
        if not isinstance(data, list):
            return []

        for item in data[:max_prs]:
            user = item.get("user", {}) or {}
            prs.append(
                GitHubPullRequest(
                    id=item.get("id", 0),
                    number=item.get("number", 0),
                    title=item.get("title", ""),
                    state=item.get("state", "open"),
                    created_at=item.get("created_at", ""),
                    closed_at=item.get("closed_at"),
                    merged_at=item.get("merged_at"),
                    is_merged=item.get("merged_at") is not None,
                    repo_full_name=f"{owner}/{repo}",
                    user_login=user.get("login"),
                )
            )

        return prs

    async def get_repo_issues(
        self,
        owner: str,
        repo: str,
        max_issues: int = 20,
    ) -> List[GitHubIssue]:
        """Fetch issues (excluding pull requests) for a repository."""
        issues = []
        response = await self._request(
            "GET",
            f"/repos/{owner}/{repo}/issues",
            params={"state": "all", "per_page": min(max_issues, 100)},
        )

        if response.status_code == 404:
            return []

        data = response.json()
        if not isinstance(data, list):
            return []

        for item in data[:max_issues]:
            # GitHub API returns PRs as issues unless pull_request key is checked
            is_pr = "pull_request" in item
            if is_pr:
                continue

            user = item.get("user", {}) or {}
            issues.append(
                GitHubIssue(
                    id=item.get("id", 0),
                    number=item.get("number", 0),
                    title=item.get("title", ""),
                    state=item.get("state", "open"),
                    created_at=item.get("created_at", ""),
                    closed_at=item.get("closed_at"),
                    comments_count=item.get("comments", 0),
                    is_pull_request=False,
                    repo_full_name=f"{owner}/{repo}",
                    user_login=user.get("login"),
                )
            )

        return issues

    async def get_repo_readme(self, owner: str, repo: str) -> Optional[GitHubReadme]:
        """Fetch and decode repo README."""
        response = await self._request("GET", f"/repos/{owner}/{repo}/readme")
        if response.status_code == 404:
            return None

        data = response.json()
        raw_content = data.get("content", "")
        encoding = data.get("encoding", "")

        decoded_text = None
        if encoding == "base64" and raw_content:
            try:
                decoded_text = base64.b64decode(raw_content).decode("utf-8", errors="replace")
            except Exception as exc:
                logger.warning(f"Failed to decode README for {owner}/{repo}: {exc}")

        return GitHubReadme(
            repo_full_name=f"{owner}/{repo}",
            content=decoded_text,
            encoding=encoding,
            size=data.get("size", 0),
        )

    async def get_file_content(self, owner: str, repo: str, filepath: str) -> Optional[str]:
        """Fetch raw content of a specific file in a repository."""
        response = await self._request("GET", f"/repos/{owner}/{repo}/contents/{filepath}")
        if response.status_code == 404:
            return None

        data = response.json()
        if isinstance(data, dict) and data.get("type") == "file":
            raw_content = data.get("content", "")
            encoding = data.get("encoding", "")
            if encoding == "base64" and raw_content:
                try:
                    return base64.b64decode(raw_content).decode("utf-8", errors="replace")
                except Exception:
                    return None
            elif "content" in data:
                return data["content"]
        return None

    async def get_rate_limit_status(self) -> GitHubRateLimit:
        """Fetch official rate limit status from /rate_limit endpoint."""
        response = await self._request("GET", "/rate_limit")
        data = response.json().get("resources", {}).get("core", {})
        return GitHubRateLimit(
            limit=data.get("limit", 60),
            remaining=data.get("remaining", 60),
            reset=data.get("reset", 0),
            used=data.get("used", 0),
        )
