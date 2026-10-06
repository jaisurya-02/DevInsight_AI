import asyncio
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session

from devinsight.config import settings
from devinsight.core.exceptions import GitHubAPIError, UserNotFoundError
from devinsight.core.logger import logger
from devinsight.cleaning.sanitizer import DataSanitizer
from devinsight.db.repository import DataRepository
from devinsight.github.client import GitHubClient
from devinsight.schemas.github import GitHubDependency
from devinsight.schemas.models import DeveloperObservationPackage, SingleRepoObservations


class DataIngestionOrchestrator:
    """Orchestrates end-to-end fetching, sanitization, and database storage for a developer profile."""

    KNOWN_DEPENDENCY_FILES = [
        ("requirements.txt", "python"),
        ("package.json", "npm"),
        ("go.mod", "go"),
    ]

    def __init__(self, github_client: Optional[GitHubClient] = None, session: Optional[Session] = None):
        self.github_client = github_client or GitHubClient()
        self.session = session

    async def fetch_developer_observations(
        self,
        username: str,
        max_repos: Optional[int] = None,
        fetch_details: bool = True,
    ) -> DeveloperObservationPackage:
        """Fetch all public observations for a GitHub developer username."""
        started_at = datetime.utcnow()
        max_repos = max_repos or settings.github_max_repos_to_fetch

        logger.info(f"Starting observation data fetch for developer '{username}'...")

        # Step 1: Fetch User Profile
        user_profile = await self.github_client.get_user_profile(username)
        user_profile.bio = DataSanitizer.sanitize_text(user_profile.bio)
        user_profile.name = DataSanitizer.sanitize_text(user_profile.name)
        user_profile.company = DataSanitizer.sanitize_text(user_profile.company)
        user_profile.location = DataSanitizer.sanitize_text(user_profile.location)

        # Step 2: Fetch Repositories
        repos = await self.github_client.get_user_repositories(
            username, max_repos=max_repos
        )

        repo_observations: List[SingleRepoObservations] = []

        if fetch_details and repos:
            # Limit concurrency to 5 repos at a time to respect rate limits
            semaphore = asyncio.Semaphore(5)

            async def process_repo(repo):
                async with semaphore:
                    return await self._fetch_single_repo_details(repo)

            repo_observations = await asyncio.gather(
                *[process_repo(repo) for repo in repos],
                return_exceptions=False,
            )
        else:
            for repo in repos:
                repo.topics = DataSanitizer.sanitize_topics(repo.topics)
                repo.description = DataSanitizer.sanitize_text(repo.description)
                repo_observations.append(
                    SingleRepoObservations(repository=repo)
                )

        package = DeveloperObservationPackage(
            user=user_profile,
            repositories=repo_observations,
            total_repos_inspected=len(repo_observations),
            fetched_at=datetime.utcnow().isoformat(),
        )

        # Step 3: Persist to DB if session provided
        if self.session:
            data_repo = DataRepository(self.session)
            try:
                data_repo.save_developer_observation_package(package)
                data_repo.log_ingestion_event(
                    username=username,
                    status="SUCCESS",
                    repos_count=len(repo_observations),
                    started_at=started_at,
                )
            except Exception as exc:
                data_repo.log_ingestion_event(
                    username=username,
                    status="FAILED",
                    repos_count=len(repo_observations),
                    error_message=str(exc),
                    started_at=started_at,
                )
                raise

        logger.info(
            f"Successfully completed data ingestion for '{username}' (repos_count={len(repo_observations)})"
        )
        return package

    async def _fetch_single_repo_details(self, repo) -> SingleRepoObservations:
        """Concurrently fetch languages, commits, PRs, issues, README, and dependencies for a repo."""
        owner = repo.owner_login
        repo_name = repo.name

        repo.topics = DataSanitizer.sanitize_topics(repo.topics)
        repo.description = DataSanitizer.sanitize_text(repo.description)

        # Concurrently fetch sub-resources
        languages_task = self.github_client.get_repo_languages(owner, repo_name)
        commits_task = self.github_client.get_repo_commits(
            owner, repo_name, max_commits=settings.github_max_commits_per_repo
        )
        prs_task = self.github_client.get_repo_pull_requests(
            owner, repo_name, max_prs=settings.github_max_prs_per_repo
        )
        issues_task = self.github_client.get_repo_issues(
            owner, repo_name, max_issues=settings.github_max_issues_per_repo
        )
        readme_task = self.github_client.get_repo_readme(owner, repo_name)

        languages, commits, prs, issues, readme = await asyncio.gather(
            languages_task,
            commits_task,
            prs_task,
            issues_task,
            readme_task,
            return_exceptions=True,
        )

        # Clean fallback handling for exceptions
        languages = languages if isinstance(languages, dict) else {}
        commits = commits if isinstance(commits, list) else []
        prs = prs if isinstance(prs, list) else []
        issues = issues if isinstance(issues, list) else []
        readme = readme if not isinstance(readme, Exception) else None

        # Sanitize commit messages
        for c in commits:
            c.commit_message = DataSanitizer.sanitize_text(c.commit_message) or ""

        # Fetch and parse dependency files
        dependencies: List[GitHubDependency] = []
        dep_tasks = [
            self._check_and_parse_dep_file(owner, repo_name, filename, ecosystem)
            for filename, ecosystem in self.KNOWN_DEPENDENCY_FILES
        ]
        dep_results = await asyncio.gather(*dep_tasks, return_exceptions=True)
        for res in dep_results:
            if isinstance(res, list):
                dependencies.extend(res)

        return SingleRepoObservations(
            repository=repo,
            languages=languages,
            commits=commits,
            pull_requests=prs,
            issues=issues,
            readme=readme,
            dependencies=dependencies,
        )

    async def _check_and_parse_dep_file(
        self, owner: str, repo: str, filename: str, ecosystem: str
    ) -> List[GitHubDependency]:
        """Fetch raw manifest file content and parse dependencies."""
        content = await self.github_client.get_file_content(owner, repo, filename)
        if not content:
            return []

        full_name = f"{owner}/{repo}"
        if filename == "requirements.txt":
            return DataSanitizer.parse_python_requirements(content, full_name, filename)
        elif filename == "package.json":
            return DataSanitizer.parse_package_json(content, full_name, filename)
        elif filename == "go.mod":
            return DataSanitizer.parse_go_mod(content, full_name, filename)

        return []
