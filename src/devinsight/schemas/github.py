from typing import List, Optional
from pydantic import BaseModel, Field


class GitHubRateLimit(BaseModel):
    """GitHub API Rate Limit Status."""
    limit: int = 0
    remaining: int = 0
    reset: int = 0
    used: int = 0


class GitHubUserProfile(BaseModel):
    """Validated GitHub User Profile response schema."""
    login: str
    id: int
    node_id: Optional[str] = None
    avatar_url: Optional[str] = None
    html_url: str
    name: Optional[str] = None
    company: Optional[str] = None
    blog: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    twitter_username: Optional[str] = None
    public_repos: int = 0
    public_gists: int = 0
    followers: int = 0
    following: int = 0
    created_at: str
    updated_at: str


class GitHubRepository(BaseModel):
    """Validated GitHub Repository response schema."""
    id: int
    name: str
    full_name: str
    owner_login: str
    html_url: str
    description: Optional[str] = None
    is_fork: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    pushed_at: Optional[str] = None
    homepage: Optional[str] = None
    size: int = 0
    stargazers_count: int = 0
    watchers_count: int = 0
    language: Optional[str] = None
    forks_count: int = 0
    open_issues_count: int = 0
    default_branch: str = "main"
    topics: List[str] = Field(default_factory=list)
    license_name: Optional[str] = None
    has_issues: bool = True
    has_projects: bool = True
    has_wiki: bool = True
    archived: bool = False
    disabled: bool = False


class GitHubCommit(BaseModel):
    """Validated GitHub Commit response schema."""
    sha: str
    commit_message: str
    author_name: Optional[str] = None
    author_email: Optional[str] = None
    commit_date: Optional[str] = None
    repo_full_name: str
    committer_name: Optional[str] = None


class GitHubPullRequest(BaseModel):
    """Validated GitHub Pull Request response schema."""
    id: int
    number: int
    title: str
    state: str
    created_at: str
    closed_at: Optional[str] = None
    merged_at: Optional[str] = None
    is_merged: bool = False
    repo_full_name: str
    user_login: Optional[str] = None


class GitHubIssue(BaseModel):
    """Validated GitHub Issue response schema."""
    id: int
    number: int
    title: str
    state: str
    created_at: str
    closed_at: Optional[str] = None
    comments_count: int = 0
    is_pull_request: bool = False
    repo_full_name: str
    user_login: Optional[str] = None


class GitHubReadme(BaseModel):
    """Validated Repository README schema."""
    repo_full_name: str
    content: Optional[str] = None
    encoding: Optional[str] = None
    size: int = 0


class GitHubDependency(BaseModel):
    """Extracted dependency specification."""
    package_name: str
    version_spec: Optional[str] = None
    ecosystem: str  # python, npm, java, go, rust, etc.
    file_source: str  # requirements.txt, package.json, etc.
    repo_full_name: str
