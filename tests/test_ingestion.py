import pytest
from unittest.mock import AsyncMock, patch
from devinsight.ingestion.orchestrator import DataIngestionOrchestrator
from devinsight.schemas.github import GitHubUserProfile, GitHubRepository


@pytest.mark.asyncio
async def test_fetch_developer_observations_orchestrator(
    in_memory_db, sample_user_profile, sample_repository
):
    mock_client = AsyncMock()
    mock_client.get_user_profile.return_value = sample_user_profile
    mock_client.get_user_repositories.return_value = [sample_repository]
    mock_client.get_repo_languages.return_value = {"Python": 5000}
    mock_client.get_repo_commits.return_value = []
    mock_client.get_repo_pull_requests.return_value = []
    mock_client.get_repo_issues.return_value = []
    mock_client.get_repo_readme.return_value = None
    mock_client.get_file_content.return_value = None

    orchestrator = DataIngestionOrchestrator(
        github_client=mock_client, session=in_memory_db
    )

    package = await orchestrator.fetch_developer_observations(
        username="octocat", max_repos=5, fetch_details=True
    )

    assert package.user.login == "octocat"
    assert len(package.repositories) == 1
    assert package.repositories[0].repository.name == "Hello-World"
    assert package.repositories[0].languages == {"Python": 5000}
