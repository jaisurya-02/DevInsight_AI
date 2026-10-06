import pytest
from unittest.mock import AsyncMock, MagicMock, patch
import httpx
from devinsight.core.exceptions import UserNotFoundError, RateLimitExceededError
from devinsight.github.client import GitHubClient


@pytest.mark.asyncio
async def test_get_user_profile_success(sample_user_profile):
    client = GitHubClient()
    mock_response = MagicMock(spec=httpx.Response)
    mock_response.status_code = 200
    mock_response.headers = {"X-RateLimit-Limit": "60", "X-RateLimit-Remaining": "59"}
    mock_response.json.return_value = {
        "login": "octocat",
        "id": 583231,
        "html_url": "https://github.com/octocat",
        "name": "The Octocat",
        "public_repos": 8,
        "created_at": "2011-01-25T18:44:36Z",
        "updated_at": "2024-03-01T12:00:00Z",
    }

    with patch.object(client, "_request", new_callable=AsyncMock) as mock_req:
        mock_req.return_value = mock_response
        profile = await client.get_user_profile("octocat")
        assert profile.login == "octocat"
        assert profile.id == 583231
        assert profile.public_repos == 8


@pytest.mark.asyncio
async def test_get_user_profile_not_found():
    client = GitHubClient()
    mock_response = MagicMock(spec=httpx.Response)
    mock_response.status_code = 404
    mock_response.headers = {}

    with patch.object(client, "_request", new_callable=AsyncMock) as mock_req:
        mock_req.return_value = mock_response
        with pytest.raises(UserNotFoundError):
            await client.get_user_profile("nonexistent_user_999")
