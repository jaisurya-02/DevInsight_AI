import asyncio
import sys
from typing import Optional
import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.tree import Tree

# Ensure UTF-8 output encoding on Windows stdout/stderr
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from devinsight import __version__
from devinsight.config import settings
from devinsight.core.exceptions import DevInsightError, UserNotFoundError
from devinsight.db.repository import DataRepository
from devinsight.db.session import SessionLocal, init_db
from devinsight.github.client import GitHubClient
from devinsight.ingestion.orchestrator import DataIngestionOrchestrator

app = typer.Typer(
    name="devinsight",
    help="DevInsight AI - GitHub Developer Intelligence Platform CLI",
    add_completion=False,
)
console = Console()


def version_callback(value: bool):
    if value:
        console.print(f"[bold cyan]DevInsight AI[/bold cyan] version: [green]{__version__}[/green]")
        raise typer.Exit()


@app.callback()
def main(
    version: Optional[bool] = typer.Option(
        None,
        "--version",
        "-v",
        help="Show version and exit.",
        callback=version_callback,
        is_eager=True,
    )
):
    """DevInsight AI CLI tool."""
    pass


@app.command()
def fetch(
    username: str = typer.Argument(..., help="GitHub username to inspect"),
    max_repos: int = typer.Option(
        20, "--max-repos", "-m", help="Maximum repositories to fetch"
    ),
    save_db: bool = typer.Option(
        True, "--save-db/--no-save-db", help="Persist fetched data to database"
    ),
):
    """Fetch publicly available GitHub data for a developer and store observations."""
    console.print(Panel.fit(f"[bold cyan]DevInsight AI Ingestion Engine[/bold cyan]\nTarget Username: [bold yellow]{username}[/bold yellow]"))

    init_db()
    session = SessionLocal() if save_db else None

    async def _run():
        async with GitHubClient() as client:
            orchestrator = DataIngestionOrchestrator(github_client=client, session=session)
            rate_status = await client.get_rate_limit_status()
            console.print(f"Rate Limit: [bold green]{rate_status.remaining}/{rate_status.limit}[/bold green] requests remaining")

            try:
                with console.status(f"[bold green]Fetching GitHub data for {username}..."):
                    package = await orchestrator.fetch_developer_observations(
                        username=username,
                        max_repos=max_repos,
                        fetch_details=True,
                    )
                return package
            except UserNotFoundError:
                console.print(f"[bold red]Error:[/bold red] GitHub user '{username}' was not found.")
                raise typer.Exit(code=1)
            except DevInsightError as err:
                console.print(f"[bold red]API/Data Error:[/bold red] {err}")
                raise typer.Exit(code=1)

    try:
        package = asyncio.run(_run())
    finally:
        if session:
            session.close()

    # Render summary table
    user = package.user
    console.print("\n[bold green][OK] Ingestion Complete![/bold green]\n")

    profile_table = Table(title=f"User Profile: {user.login}", show_header=True, header_style="bold magenta")
    profile_table.add_column("Property", style="cyan")
    profile_table.add_column("Observation Value", style="white")

    profile_table.add_row("Name", user.name or "N/A")
    profile_table.add_row("Company", user.company or "N/A")
    profile_table.add_row("Location", user.location or "N/A")
    profile_table.add_row("Bio", user.bio or "N/A")
    profile_table.add_row("Public Repositories", str(user.public_repos))
    profile_table.add_row("Followers / Following", f"{user.followers} / {user.following}")
    profile_table.add_row("Account Created", user.created_at)

    console.print(profile_table)

    # Render repos tree summary
    repo_tree = Tree(f"Inspected Repositories ({len(package.repositories)})")
    for single_repo in package.repositories:
        repo = single_repo.repository
        lang = repo.language or "Unknown"
        branch = f" [bold yellow]({lang})[/bold yellow]"
        r_node = repo_tree.add(f"[bold white]{repo.name}[/bold white]{branch} - Stars: {repo.stargazers_count}")
        if single_repo.commits:
            r_node.add(f"Commits inspected: {len(single_repo.commits)}")
        if single_repo.languages:
            r_node.add(f"Languages: {', '.join(single_repo.languages.keys())}")
        if single_repo.dependencies:
            r_node.add(f"Dependencies detected: {len(single_repo.dependencies)}")

    console.print(repo_tree)


@app.command()
def show(username: str = typer.Argument(..., help="GitHub username to query")):
    """Query ingested data for a developer from the local database."""
    init_db()
    session = SessionLocal()
    try:
        repo = DataRepository(session)
        user = repo.get_user_with_repos(username)
        if not user:
            console.print(f"[bold red]No data found in database for user '{username}'.[/bold red]")
            console.print("Run `devinsight fetch <username>` first.")
            raise typer.Exit(code=1)

        console.print(f"[bold cyan]User Profile in Database:[/bold cyan] {user.login}")
        console.print(f"Name: {user.name}")
        console.print(f"Repositories Stored: {len(user.repositories)}")
        for r in user.repositories:
            console.print(f" - [bold white]{r.name}[/bold white] ({r.language or 'N/A'}) - Stars: {r.stargazers_count}")
    finally:
        session.close()


@app.command()
def status():
    """Display API status and database configuration."""
    console.print(Panel.fit("[bold cyan]DevInsight AI System Status[/bold cyan]"))
    console.print(f"Environment: [bold yellow]{settings.app_env}[/bold yellow]")
    console.print(f"Database URL: [bold yellow]{settings.database_url}[/bold yellow]")
    console.print(f"GitHub API Base URL: [bold yellow]{settings.github_api_base_url}[/bold yellow]")

    async def _check():
        async with GitHubClient() as client:
            return await client.get_rate_limit_status()

    try:
        rl = asyncio.run(_check())
        console.print(f"GitHub API Rate Limit: [bold green]{rl.remaining} / {rl.limit}[/bold green] remaining")
    except Exception as e:
        console.print(f"[bold red]API Connection Warning:[/bold red] {e}")


if __name__ == "__main__":
    app()
