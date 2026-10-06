from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from devinsight.config import settings
from devinsight.db.models import Base


def get_engine(db_url: str = None):
    """Create SQLAlchemy engine with appropriate settings."""
    url = db_url or settings.database_url
    connect_args = {}

    if url.startswith("sqlite"):
        connect_args["check_same_thread"] = False

    return create_engine(
        url,
        connect_args=connect_args,
        pool_pre_ping=True,
    )


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db(db_engine=None):
    """Initialize database tables."""
    target_engine = db_engine or engine
    Base.metadata.create_all(bind=target_engine)


def get_db_session() -> Generator[Session, None, None]:
    """Dependency / context helper to yield a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
