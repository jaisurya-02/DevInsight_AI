import json
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from devinsight.core.exceptions import StorageError
from devinsight.core.logger import logger
from devinsight.db.models import (
    UserModel,
    RepositoryModel,
    RepositoryLanguageModel,
    CommitModel,
    PullRequestModel,
    IssueModel,
    RepositoryReadmeModel,
    RepositoryDependencyModel,
    IngestionLogModel,
)
from devinsight.schemas.models import DeveloperObservationPackage


class DataRepository:
    """Repository class for persisting GitHub developer observations into the database."""

    def __init__(self, session: Session):
        self.session = session

    def save_developer_observation_package(
        self, package: DeveloperObservationPackage
    ) -> UserModel:
        """Persist a complete DeveloperObservationPackage to the database atomically."""
        try:
            user_data = package.user
            existing_user = (
                self.session.query(UserModel)
                .filter(UserModel.login == user_data.login)
                .first()
            )

            if existing_user:
                user_model = existing_user
                user_model.name = user_data.name
                user_model.company = user_data.company
                user_model.blog = user_data.blog
                user_model.location = user_data.location
                user_model.email = user_data.email
                user_model.bio = user_data.bio
                user_model.avatar_url = user_data.avatar_url
                user_model.public_repos = user_data.public_repos
                user_model.public_gists = user_data.public_gists
                user_model.followers = user_data.followers
                user_model.following = user_data.following
                user_model.github_updated_at = user_data.updated_at
                user_model.fetched_at = datetime.utcnow()
            else:
                user_model = UserModel(
                    id=user_data.id,
                    login=user_data.login,
                    name=user_data.name,
                    company=user_data.company,
                    blog=user_data.blog,
                    location=user_data.location,
                    email=user_data.email,
                    bio=user_data.bio,
                    avatar_url=user_data.avatar_url,
                    public_repos=user_data.public_repos,
                    public_gists=user_data.public_gists,
                    followers=user_data.followers,
                    following=user_data.following,
                    github_created_at=user_data.created_at,
                    github_updated_at=user_data.updated_at,
                    fetched_at=datetime.utcnow(),
                )
                self.session.add(user_model)

            self.session.flush()

            # Save Repositories and child entities
            for single_repo in package.repositories:
                repo = single_repo.repository
                existing_repo = (
                    self.session.query(RepositoryModel)
                    .filter(RepositoryModel.full_name == repo.full_name)
                    .first()
                )

                topics_str = json.dumps(repo.topics) if repo.topics else None

                if existing_repo:
                    repo_model = existing_repo
                    repo_model.description = repo.description
                    repo_model.is_fork = repo.is_fork
                    repo_model.updated_at = repo.updated_at
                    repo_model.pushed_at = repo.pushed_at
                    repo_model.homepage = repo.homepage
                    repo_model.size = repo.size
                    repo_model.stargazers_count = repo.stargazers_count
                    repo_model.watchers_count = repo.watchers_count
                    repo_model.language = repo.language
                    repo_model.forks_count = repo.forks_count
                    repo_model.open_issues_count = repo.open_issues_count
                    repo_model.default_branch = repo.default_branch
                    repo_model.topics_json = topics_str
                    repo_model.license_name = repo.license_name
                    repo_model.archived = repo.archived

                    # Clear existing child items for refresh
                    self.session.query(RepositoryLanguageModel).filter(
                        RepositoryLanguageModel.repo_full_name == repo.full_name
                    ).delete()
                    self.session.query(RepositoryDependencyModel).filter(
                        RepositoryDependencyModel.repo_full_name == repo.full_name
                    ).delete()
                else:
                    repo_model = RepositoryModel(
                        id=repo.id,
                        name=repo.name,
                        full_name=repo.full_name,
                        user_login=user_model.login,
                        html_url=repo.html_url,
                        description=repo.description,
                        is_fork=repo.is_fork,
                        created_at=repo.created_at,
                        updated_at=repo.updated_at,
                        pushed_at=repo.pushed_at,
                        homepage=repo.homepage,
                        size=repo.size,
                        stargazers_count=repo.stargazers_count,
                        watchers_count=repo.watchers_count,
                        language=repo.language,
                        forks_count=repo.forks_count,
                        open_issues_count=repo.open_issues_count,
                        default_branch=repo.default_branch,
                        topics_json=topics_str,
                        license_name=repo.license_name,
                        archived=repo.archived,
                    )
                    self.session.add(repo_model)

                self.session.flush()

                # Languages
                for lang_name, bytes_cnt in single_repo.languages.items():
                    lang_model = RepositoryLanguageModel(
                        repo_full_name=repo.full_name,
                        language=lang_name,
                        bytes_count=bytes_cnt,
                    )
                    self.session.add(lang_model)

                # Commits
                for commit in single_repo.commits:
                    existing_commit = (
                        self.session.query(CommitModel)
                        .filter(CommitModel.sha == commit.sha)
                        .first()
                    )
                    if not existing_commit:
                        commit_model = CommitModel(
                            sha=commit.sha,
                            repo_full_name=repo.full_name,
                            commit_message=commit.commit_message,
                            author_name=commit.author_name,
                            author_email=commit.author_email,
                            commit_date=commit.commit_date,
                        )
                        self.session.add(commit_model)

                # Pull Requests
                for pr in single_repo.pull_requests:
                    existing_pr = (
                        self.session.query(PullRequestModel)
                        .filter(PullRequestModel.id == pr.id)
                        .first()
                    )
                    if existing_pr:
                        existing_pr.state = pr.state
                        existing_pr.is_merged = pr.is_merged
                        existing_pr.closed_at = pr.closed_at
                        existing_pr.merged_at = pr.merged_at
                    else:
                        pr_model = PullRequestModel(
                            id=pr.id,
                            number=pr.number,
                            repo_full_name=repo.full_name,
                            title=pr.title,
                            state=pr.state,
                            is_merged=pr.is_merged,
                            created_at=pr.created_at,
                            closed_at=pr.closed_at,
                            merged_at=pr.merged_at,
                            user_login=pr.user_login,
                        )
                        self.session.add(pr_model)

                # Issues
                for issue in single_repo.issues:
                    existing_issue = (
                        self.session.query(IssueModel)
                        .filter(IssueModel.id == issue.id)
                        .first()
                    )
                    if existing_issue:
                        existing_issue.state = issue.state
                        existing_issue.comments_count = issue.comments_count
                        existing_issue.closed_at = issue.closed_at
                    else:
                        issue_model = IssueModel(
                            id=issue.id,
                            number=issue.number,
                            repo_full_name=repo.full_name,
                            title=issue.title,
                            state=issue.state,
                            comments_count=issue.comments_count,
                            created_at=issue.created_at,
                            closed_at=issue.closed_at,
                            user_login=issue.user_login,
                        )
                        self.session.add(issue_model)

                # README
                if single_repo.readme and single_repo.readme.content:
                    existing_readme = (
                        self.session.query(RepositoryReadmeModel)
                        .filter(RepositoryReadmeModel.repo_full_name == repo.full_name)
                        .first()
                    )
                    if existing_readme:
                        existing_readme.content = single_repo.readme.content
                        existing_readme.size = single_repo.readme.size
                    else:
                        readme_model = RepositoryReadmeModel(
                            repo_full_name=repo.full_name,
                            content=single_repo.readme.content,
                            size=single_repo.readme.size,
                        )
                        self.session.add(readme_model)

                # Dependencies
                for dep in single_repo.dependencies:
                    dep_model = RepositoryDependencyModel(
                        repo_full_name=repo.full_name,
                        package_name=dep.package_name,
                        version_spec=dep.version_spec,
                        ecosystem=dep.ecosystem,
                        file_source=dep.file_source,
                    )
                    self.session.add(dep_model)

            self.session.commit()
            logger.info(
                f"Successfully saved observation package for username={user_data.login}, repos_count={len(package.repositories)}"
            )
            return user_model

        except Exception as exc:
            self.session.rollback()
            logger.error(f"Failed to save observation package: {exc}")
            raise StorageError(f"Database storage failed: {str(exc)}")

    def log_ingestion_event(
        self,
        username: str,
        status: str,
        repos_count: int = 0,
        error_message: Optional[str] = None,
        started_at: Optional[datetime] = None,
    ) -> IngestionLogModel:
        """Create a log entry recording an ingestion attempt."""
        log_entry = IngestionLogModel(
            username=username,
            repos_count=repos_count,
            status=status,
            error_message=error_message,
            started_at=started_at or datetime.utcnow(),
            completed_at=datetime.utcnow(),
        )
        self.session.add(log_entry)
        self.session.commit()
        return log_entry

    def get_user_with_repos(self, username: str) -> Optional[UserModel]:
        """Fetch user record along with repositories."""
        return (
            self.session.query(UserModel)
            .filter(UserModel.login == username)
            .first()
        )
