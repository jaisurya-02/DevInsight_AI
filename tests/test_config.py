from devinsight.config import settings


def test_settings_default_values():
    """Verify application configuration default settings."""
    assert settings.github_api_base_url == "https://api.github.com"
    assert settings.github_api_timeout == 30.0
    assert settings.github_max_repos_to_fetch >= 1
    assert "sqlite" in settings.database_url or "postgresql" in settings.database_url
