import time
from devinsight.core.logger import logger
from devinsight.schemas.github import GitHubRateLimit


class RateLimitTracker:
    """Tracks and manages GitHub REST API rate limits."""

    def __init__(self):
        self.limit: int = 60
        self.remaining: int = 60
        self.reset_timestamp: int = 0

    def update_from_headers(self, headers: dict):
        """Update rate limit state from HTTP response headers."""
        if "X-RateLimit-Limit" in headers:
            self.limit = int(headers.get("X-RateLimit-Limit", self.limit))
        if "X-RateLimit-Remaining" in headers:
            self.remaining = int(headers.get("X-RateLimit-Remaining", self.remaining))
        if "X-RateLimit-Reset" in headers:
            self.reset_timestamp = int(headers.get("X-RateLimit-Reset", self.reset_timestamp))

        logger.debug(
            f"GitHub Rate Limit Update: remaining={self.remaining}, limit={self.limit}, reset_time={self.reset_timestamp}"
        )

    def is_exhausted(self) -> bool:
        """Return True if rate limit is exhausted."""
        return self.remaining <= 1 and time.time() < self.reset_timestamp

    def time_until_reset(self) -> float:
        """Return seconds remaining until rate limit resets."""
        now = time.time()
        if self.reset_timestamp > now:
            return self.reset_timestamp - now
        return 0.0

    def get_status(self) -> GitHubRateLimit:
        """Return rate limit Pydantic model."""
        return GitHubRateLimit(
            limit=self.limit,
            remaining=self.remaining,
            reset=self.reset_timestamp,
            used=self.limit - self.remaining,
        )
