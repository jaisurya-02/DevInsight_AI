"""DevInsight AI FastAPI Application."""
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from devinsight.config import settings
from devinsight.core.logger import logger
from devinsight.db.session import get_db_session, init_db
from devinsight.github.client import GitHubClient
from devinsight.ingestion.orchestrator import DataIngestionOrchestrator
from devinsight.analytics.engine import AnalyticsEngine

# Initialize database tables on app startup
init_db()

app = FastAPI(
    title="DevInsight AI Backend API",
    description="Real-time developer intelligence API analyzing public GitHub activity, repository metrics, and technical exposure.",
    version="0.1.0",
)

# Enable CORS for frontend Vite dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    """Health check endpoint showing GitHub rate limit and API status."""
    async with GitHubClient() as client:
        rate_status = await client.get_rate_limit_status()
    return {
        "status": "healthy",
        "app_env": settings.app_env,
        "database_url": settings.database_url.split("@")[-1] if "@" in settings.database_url else settings.database_url,
        "github_rate_limit": {
            "limit": rate_status.limit,
            "remaining": rate_status.remaining,
            "used": rate_status.used,
            "reset": rate_status.reset,
        },
    }


@app.get("/api/developer/{username}")
async def get_developer_insights(
    username: str,
    db: Session = Depends(get_db_session),
):
    """Retrieve full developer insights. If not already ingested, triggers on-the-fly ingestion."""
    clean_username = username.strip().lower()
    analytics = AnalyticsEngine(db)
    insights = analytics.generate_complete_insights(clean_username)

    if not insights:
        # User not yet in database -> run on-the-fly ingestion
        logger.info(f"Developer '{clean_username}' not found in database. Ingesting live from GitHub...")
        orchestrator = DataIngestionOrchestrator(session=db)
        try:
            await orchestrator.fetch_developer_observations(
                clean_username,
                max_repos=settings.github_max_repos_to_fetch,
                fetch_details=True,
            )
        except Exception as exc:
            logger.error(f"Failed to ingest developer '{clean_username}': {exc}")
            raise HTTPException(
                status_code=404,
                detail=f"GitHub developer '{clean_username}' could not be fetched or does not exist: {str(exc)}",
            )

        insights = analytics.generate_complete_insights(clean_username)

    if not insights:
        raise HTTPException(
            status_code=404,
            detail=f"Developer '{clean_username}' has no accessible public repositories or observations.",
        )

    return insights


@app.post("/api/analyze/{username}")
async def analyze_developer(
    username: str,
    max_repos: Optional[int] = Query(default=30, ge=1, le=100),
    db: Session = Depends(get_db_session),
):
    """Trigger live GitHub ingestion and return freshly computed insights."""
    clean_username = username.strip().lower()
    logger.info(f"Received request to analyze developer '{clean_username}' (max_repos={max_repos})...")

    orchestrator = DataIngestionOrchestrator(session=db)
    try:
        await orchestrator.fetch_developer_observations(
            clean_username,
            max_repos=max_repos,
            fetch_details=True,
        )
    except Exception as exc:
        logger.error(f"Analysis ingestion failed for '{clean_username}': {exc}")
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch GitHub data for '{clean_username}': {str(exc)}",
        )

    analytics = AnalyticsEngine(db)
    insights = analytics.generate_complete_insights(clean_username)

    if not insights:
        raise HTTPException(
            status_code=404,
            detail=f"No observations could be generated for '{clean_username}'.",
        )

    return insights


@app.get("/api/developer/{username}/repositories")
async def get_developer_repositories(
    username: str,
    db: Session = Depends(get_db_session),
):
    """Retrieve repository breakdown for developer."""
    clean_username = username.strip().lower()
    analytics = AnalyticsEngine(db)
    insights = analytics.generate_complete_insights(clean_username)
    if not insights:
        raise HTTPException(status_code=404, detail="Developer not found.")
    return insights["repositories"]


@app.get("/api/developer/{username}/skills")
async def get_developer_skills(
    username: str,
    db: Session = Depends(get_db_session),
):
    """Retrieve skill groupings and gap analysis for developer."""
    clean_username = username.strip().lower()
    analytics = AnalyticsEngine(db)
    insights = analytics.generate_complete_insights(clean_username)
    if not insights:
        raise HTTPException(status_code=404, detail="Developer not found.")
    return {
        "skillGroups": insights["skillGroups"],
        "skillGap": insights["skillGap"],
        "recommendations": insights["recommendations"],
    }


@app.get("/api/developer/{username}/growth")
async def get_developer_growth(
    username: str,
    db: Session = Depends(get_db_session),
):
    """Retrieve growth trajectory and timeline for developer."""
    clean_username = username.strip().lower()
    analytics = AnalyticsEngine(db)
    insights = analytics.generate_complete_insights(clean_username)
    if not insights:
        raise HTTPException(status_code=404, detail="Developer not found.")
    return insights["growth"]
