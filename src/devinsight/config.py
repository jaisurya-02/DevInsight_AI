from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application Settings for DevInsight AI."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # GitHub API Configuration
    github_token: Optional[str] = Field(
        default=None,
        description="GitHub Personal Access Token for higher rate limits (5000 req/hr vs 60 req/hr).",
    )
    github_api_base_url: str = Field(
        default="https://api.github.com",
        description="Base URL for the GitHub REST API.",
    )
    github_api_timeout: float = Field(
        default=30.0,
        description="HTTP request timeout in seconds.",
    )
    github_max_repos_to_fetch: int = Field(
        default=50,
        description="Maximum public repositories to fetch per developer.",
    )
    github_max_commits_per_repo: int = Field(
        default=30,
        description="Maximum commits to inspect per repository.",
    )
    github_max_prs_per_repo: int = Field(
        default=20,
        description="Maximum pull requests to inspect per repository.",
    )
    github_max_issues_per_repo: int = Field(
        default=20,
        description="Maximum issues to inspect per repository.",
    )

    # Database Configuration
    database_url: str = Field(
        default="sqlite:///./devinsight.db",
        description="SQLAlchemy database connection string (PostgreSQL or SQLite).",
    )

    # Logging & Environment
    app_env: str = Field(default="development", description="Execution environment.")
    log_level: str = Field(default="INFO", description="Logging level.")


# Global settings singleton
settings = Settings()
