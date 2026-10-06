from datetime import datetime
from typing import Optional
from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class UserModel(Base):
    """SQLAlchemy ORM model for GitHub user profiles."""
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    login = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    blog = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(Text, nullable=True)
    public_repos = Column(Integer, default=0)
    public_gists = Column(Integer, default=0)
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    github_created_at = Column(String(100), nullable=True)
    github_updated_at = Column(String(100), nullable=True)
    fetched_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    repositories = relationship("RepositoryModel", back_populates="user", cascade="all, delete-orphan")


class RepositoryModel(Base):
    """SQLAlchemy ORM model for GitHub repositories."""
    __tablename__ = "repositories"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    full_name = Column(String(255), unique=True, nullable=False, index=True)
    user_login = Column(String(255), ForeignKey("users.login", ondelete="CASCADE"), nullable=False, index=True)
    html_url = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    is_fork = Column(Boolean, default=False)
    created_at = Column(String(100), nullable=True)
    updated_at = Column(String(100), nullable=True)
    pushed_at = Column(String(100), nullable=True)
    homepage = Column(Text, nullable=True)
    size = Column(Integer, default=0)
    stargazers_count = Column(Integer, default=0)
    watchers_count = Column(Integer, default=0)
    language = Column(String(100), nullable=True, index=True)
    forks_count = Column(Integer, default=0)
    open_issues_count = Column(Integer, default=0)
    default_branch = Column(String(100), default="main")
    topics_json = Column(Text, nullable=True)  # JSON-encoded array of topic strings
    license_name = Column(String(255), nullable=True)
    archived = Column(Boolean, default=False)

    user = relationship("UserModel", back_populates="repositories")
    languages = relationship("RepositoryLanguageModel", back_populates="repository", cascade="all, delete-orphan")
    commits = relationship("CommitModel", back_populates="repository", cascade="all, delete-orphan")
    pull_requests = relationship("PullRequestModel", back_populates="repository", cascade="all, delete-orphan")
    issues = relationship("IssueModel", back_populates="repository", cascade="all, delete-orphan")
    readme = relationship("RepositoryReadmeModel", back_populates="repository", uselist=False, cascade="all, delete-orphan")
    dependencies = relationship("RepositoryDependencyModel", back_populates="repository", cascade="all, delete-orphan")


class RepositoryLanguageModel(Base):
    """SQLAlchemy ORM model for languages per repository."""
    __tablename__ = "repository_languages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    repo_full_name = Column(String(255), ForeignKey("repositories.full_name", ondelete="CASCADE"), nullable=False, index=True)
    language = Column(String(100), nullable=False)
    bytes_count = Column(BigInteger, default=0)

    __table_args__ = (
        UniqueConstraint("repo_full_name", "language", name="uq_repo_language"),
    )

    repository = relationship("RepositoryModel", back_populates="languages")


class CommitModel(Base):
    """SQLAlchemy ORM model for commit records."""
    __tablename__ = "commits"

    sha = Column(String(100), primary_key=True)
    repo_full_name = Column(String(255), ForeignKey("repositories.full_name", ondelete="CASCADE"), nullable=False, index=True)
    commit_message = Column(Text, nullable=True)
    author_name = Column(String(255), nullable=True)
    author_email = Column(String(255), nullable=True)
    commit_date = Column(String(100), nullable=True)

    repository = relationship("RepositoryModel", back_populates="commits")


class PullRequestModel(Base):
    """SQLAlchemy ORM model for pull request records."""
    __tablename__ = "pull_requests"

    id = Column(BigInteger, primary_key=True)
    number = Column(Integer, nullable=False)
    repo_full_name = Column(String(255), ForeignKey("repositories.full_name", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(Text, nullable=False)
    state = Column(String(50), nullable=False)
    is_merged = Column(Boolean, default=False)
    created_at = Column(String(100), nullable=True)
    closed_at = Column(String(100), nullable=True)
    merged_at = Column(String(100), nullable=True)
    user_login = Column(String(255), nullable=True)

    repository = relationship("RepositoryModel", back_populates="pull_requests")


class IssueModel(Base):
    """SQLAlchemy ORM model for issue records."""
    __tablename__ = "issues"

    id = Column(BigInteger, primary_key=True)
    number = Column(Integer, nullable=False)
    repo_full_name = Column(String(255), ForeignKey("repositories.full_name", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(Text, nullable=False)
    state = Column(String(50), nullable=False)
    comments_count = Column(Integer, default=0)
    created_at = Column(String(100), nullable=True)
    closed_at = Column(String(100), nullable=True)
    user_login = Column(String(255), nullable=True)

    repository = relationship("RepositoryModel", back_populates="issues")


class RepositoryReadmeModel(Base):
    """SQLAlchemy ORM model for repo README content."""
    __tablename__ = "repository_readmes"

    repo_full_name = Column(String(255), ForeignKey("repositories.full_name", ondelete="CASCADE"), primary_key=True)
    content = Column(Text, nullable=True)
    size = Column(Integer, default=0)

    repository = relationship("RepositoryModel", back_populates="readme")


class RepositoryDependencyModel(Base):
    """SQLAlchemy ORM model for repository dependencies."""
    __tablename__ = "repository_dependencies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    repo_full_name = Column(String(255), ForeignKey("repositories.full_name", ondelete="CASCADE"), nullable=False, index=True)
    package_name = Column(String(255), nullable=False, index=True)
    version_spec = Column(String(100), nullable=True)
    ecosystem = Column(String(50), nullable=False, index=True)
    file_source = Column(String(255), nullable=False)

    repository = relationship("RepositoryModel", back_populates="dependencies")


class IngestionLogModel(Base):
    """SQLAlchemy ORM model tracking data ingestion jobs."""
    __tablename__ = "ingestion_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), nullable=False, index=True)
    repos_count = Column(Integer, default=0)
    status = Column(String(50), nullable=False)  # SUCCESS, FAILED, PARTIAL
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
