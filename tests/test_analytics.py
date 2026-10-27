import pytest
from devinsight.analytics.engine import AnalyticsEngine
from devinsight.db.models import (
    UserModel,
    RepositoryModel,
    RepositoryLanguageModel,
    CommitModel,
    PullRequestModel,
    IssueModel,
)


def test_analytics_engine_empty_db(in_memory_db):
    """Engine returns None when user is not found in database."""
    engine = AnalyticsEngine(in_memory_db)
    insights = engine.generate_complete_insights("nonexistent_user")
    assert insights is None


def test_analytics_engine_with_sample_user(in_memory_db, sample_user_profile, sample_repository):
    """Engine computes valid complete insights for a known user."""
    # 1. Insert user
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
    in_memory_db.add(user)

    # 2. Insert repository
    repo = RepositoryModel(
        id=sample_repository.id,
        user_login=sample_user_profile.login,
        name=sample_repository.name,
        full_name=sample_repository.full_name,
        description=sample_repository.description,
        is_fork=False,
        language="TypeScript",
        stargazers_count=42,
        forks_count=5,
        watchers_count=10,
        html_url=sample_repository.html_url,
    )
    in_memory_db.add(repo)

    # 3. Insert repository language
    lang = RepositoryLanguageModel(
        repo_full_name=sample_repository.full_name,
        language="TypeScript",
        bytes_count=25000,
    )
    in_memory_db.add(lang)

    # 4. Insert sample commit
    commit = CommitModel(
        sha="abc1234567890",
        repo_full_name=sample_repository.full_name,
        author_name=sample_user_profile.name,
        commit_date="2026-10-15T12:00:00Z",
        commit_message="feat: initial release",
    )
    in_memory_db.add(commit)

    in_memory_db.commit()

    engine = AnalyticsEngine(in_memory_db)
    insights = engine.generate_complete_insights(sample_user_profile.login)

    assert insights is not None
    assert "profile" in insights
    assert insights["profile"]["username"] == sample_user_profile.login
    assert insights["profile"]["stats"]["publicRepos"] >= 1
    assert len(insights["languages"]) > 0
    assert insights["languages"][0]["name"] == "TypeScript"
    assert len(insights["monthlyActivity"]) == 12
    assert len(insights["heatmapData"]) == 365
    assert len(insights["repositories"]) == 1
    assert "growth" in insights
    assert len(insights["growth"]["activityTrend"]) == 12
