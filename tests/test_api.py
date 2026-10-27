import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from devinsight.api.main import app
from devinsight.db.session import get_db_session
from devinsight.db.models import UserModel


from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from devinsight.db.models import Base


@pytest.fixture
def client_with_db():
    """Create isolated in-memory test database with StaticPool for FastAPI test client."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    test_db = TestingSessionLocal()

    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db_session] = override_get_db
    with TestClient(app) as test_client:
        yield test_client, test_db
    app.dependency_overrides.clear()
    test_db.close()


def test_api_health():
    """Verify health endpoint responds with system status."""
    with TestClient(app) as test_client:
        response = test_client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "github_rate_limit" in data


def test_get_developer_existing_in_db(client_with_db, sample_user_profile):
    """Retrieve developer when already cached in database."""
    test_client, db = client_with_db

    user = UserModel(
        id=sample_user_profile.id,
        login=sample_user_profile.login,
        name=sample_user_profile.name,
        avatar_url=sample_user_profile.avatar_url,
        bio=sample_user_profile.bio,
        company=sample_user_profile.company,
        location=sample_user_profile.location,
        blog=sample_user_profile.blog,
        public_repos=sample_user_profile.public_repos,
        followers=sample_user_profile.followers,
        following=sample_user_profile.following,
    )
    db.add(user)
    db.commit()

    response = test_client.get(f"/api/developer/{sample_user_profile.login}")
    assert response.status_code == 200
    data = response.json()
    assert data["profile"]["username"] == sample_user_profile.login
    assert "rolePrediction" in data
    assert "monthlyActivity" in data
