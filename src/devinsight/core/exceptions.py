"""Custom exceptions for DevInsight AI."""

class DevInsightError(Exception):
    """Base exception for all DevInsight AI errors."""
    pass


class GitHubAPIError(DevInsightError):
    """Raised when GitHub REST API returns an error status code or unexpected payload."""
    def __init__(self, message: str, status_code: int = 500, details: dict = None):
        super().__init__(message)
        self.status_code = status_code
        self.details = details or {}


class RateLimitExceededError(GitHubAPIError):
    """Raised when GitHub API rate limit is exhausted."""
    def __init__(self, reset_time: int = 0, message: str = "GitHub API rate limit exceeded."):
        super().__init__(message=message, status_code=429)
        self.reset_time = reset_time


class UserNotFoundError(GitHubAPIError):
    """Raised when the specified GitHub user does not exist."""
    def __init__(self, username: str):
        super().__init__(message=f"GitHub user '{username}' was not found.", status_code=404)
        self.username = username


class RepositoryNotFoundError(GitHubAPIError):
    """Raised when a specific repository is not found or accessible."""
    def __init__(self, repo_full_name: str):
        super().__init__(message=f"Repository '{repo_full_name}' was not found.", status_code=404)
        self.repo_full_name = repo_full_name


class DataValidationError(DevInsightError):
    """Raised when data validation fails during cleaning or parsing."""
    pass


class StorageError(DevInsightError):
    """Raised when database operations fail."""
    pass
