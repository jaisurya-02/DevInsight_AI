from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from devinsight.schemas.github import (
    GitHubUserProfile,
    GitHubRepository,
    GitHubCommit,
    GitHubPullRequest,
    GitHubIssue,
    GitHubReadme,
    GitHubDependency,
)


class RepoLanguageBreakdown(BaseModel):
    """Language usage breakdown in bytes for a repo."""
    repo_full_name: str
    languages: Dict[str, int] = Field(default_factory=dict)


class SingleRepoObservations(BaseModel):
    """All collected data for a single repository."""
    repository: GitHubRepository
    languages: Dict[str, int] = Field(default_factory=dict)
    commits: List[GitHubCommit] = Field(default_factory=list)
    pull_requests: List[GitHubPullRequest] = Field(default_factory=list)
    issues: List[GitHubIssue] = Field(default_factory=list)
    readme: Optional[GitHubReadme] = None
    dependencies: List[GitHubDependency] = Field(default_factory=list)


class DeveloperObservationPackage(BaseModel):
    """Complete raw observation bundle for a single developer."""
    user: GitHubUserProfile
    repositories: List[SingleRepoObservations] = Field(default_factory=list)
    total_repos_inspected: int = 0
    fetched_at: str
