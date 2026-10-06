from devinsight.db.repository import DataRepository
from devinsight.schemas.models import (
    DeveloperObservationPackage,
    SingleRepoObservations,
)


def test_save_developer_observation_package(in_memory_db, sample_user_profile, sample_repository):
    repo_storage = DataRepository(in_memory_db)

    single_repo_obs = SingleRepoObservations(
        repository=sample_repository,
        languages={"Python": 1024, "HTML": 256},
        commits=[],
        pull_requests=[],
        issues=[],
        readme=None,
        dependencies=[],
    )

    package = DeveloperObservationPackage(
        user=sample_user_profile,
        repositories=[single_repo_obs],
        total_repos_inspected=1,
        fetched_at="2026-10-06T12:00:00Z",
    )

    # Save to database
    user_model = repo_storage.save_developer_observation_package(package)
    assert user_model.login == "octocat"
    assert len(user_model.repositories) == 1
    assert user_model.repositories[0].name == "Hello-World"

    # Query from DB
    retrieved_user = repo_storage.get_user_with_repos("octocat")
    assert retrieved_user is not None
    assert retrieved_user.login == "octocat"
    assert retrieved_user.repositories[0].language == "Python"
