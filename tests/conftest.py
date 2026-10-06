import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from devinsight.db.models import Base
from devinsight.schemas.github import GitHubUserProfile, GitHubRepository


@pytest.fixture
def in_memory_db():
    """Create an in-memory SQLite database engine for testing."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def sample_user_profile():
    """Return a valid sample GitHubUserProfile."""
    return GitHubUserProfile(
        login="octocat",
        id=583231,
        node_id="MDQ6VXNlcjU4MzIzMQ==",
        avatar_url="https://avatars.githubusercontent.com/u/583231?v=4",
        html_url="https://github.com/octocat",
        name="The Octocat",
        company="@github",
        blog="https://github.blog",
        location="San Francisco",
        email="octocat@github.com",
        bio="GitHub's mascot and developer community icon.",
        public_repos=8,
        public_gists=8,
        followers=10000,
        following=9,
        created_at="2011-01-25T18:44:36Z",
        updated_at="2024-03-01T12:00:00Z",
    )


@pytest.fixture
def sample_repository():
    """Return a valid sample GitHubRepository."""
    return GitHubRepository(
        id=1296269,
        name="Hello-World",
        full_name="octocat/Hello-World",
        owner_login="octocat",
        html_url="https://github.com/octocat/Hello-World",
        description="My first repository on GitHub!",
        is_fork=False,
        created_at="2011-01-26T19:01:12Z",
        updated_at="2024-02-15T08:30:00Z",
        pushed_at="2024-02-15T08:30:00Z",
        homepage="",
        size=108,
        stargazers_count=2000,
        watchers_count=2000,
        language="Python",
        forks_count=500,
        open_issues_count=2,
        default_branch="master",
        topics=["octocat", "hello-world", "example"],
        license_name="MIT License",
    )
