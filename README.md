# DevInsight AI — GitHub Developer Intelligence Platform

**DevInsight AI** is a production-oriented developer intelligence platform that analyzes public GitHub activity, repository data, language breakdown, and documentation to generate structured insights about a developer's technical exposure and open-source contributions.

---

## 📌 Phase 1 Completed: Data Ingestion & Storage Architecture

Phase 1 establishes the foundational data ingestion pipeline, REST API client, data sanitizer, database models, and CLI runner.

### Architecture Overview

```text
GitHub REST API
       ↓
[GitHubClient] (Async, Rate-Limit Tracking, Exponential Retry)
       ↓
[DataSanitizer] (Sanitizes fields, Deduplicates topics, Parses dependencies)
       ↓
[DataIngestionOrchestrator] (Concurrently fetches Profile, Repos, Commits, PRs, Issues, READMEs, Dependencies)
       ↓
[DataRepository & SQLAlchemy ORM] (Supports PostgreSQL & SQLite)
       ↓
[Cli Interface & Test Suite] (Rich CLI + Pytest suite)
```

---

## 🚀 Setup & Installation

### 1. Create Virtual Environment
```bash
python -m venv .venv
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
```

### 2. Install Package & Dependencies
```bash
pip install -r requirements.txt
pip install -e .
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and optionally set your `GITHUB_TOKEN`:
```env
GITHUB_TOKEN=your_github_personal_access_token_here
DATABASE_URL=sqlite:///./devinsight.db
```

---

## 💻 CLI Usage

### Check System Status
```bash
devinsight status
```

### Fetch & Ingest Developer Data
```bash
devinsight fetch <username> --max-repos 20
```

### Query Database Records
```bash
devinsight show <username>
```

---

## 🧪 Test Suite

Run the full automated test suite with pytest:
```bash
pytest
```

---

## 🛡️ Product Principles & Ethics

GitHub activity does **NOT** objectively determine someone's intelligence, programming ability, personality, or professional worth. All analytics in DevInsight AI are presented as **Activity Indicators**, **Observed Skills**, and **Model Predictions** rather than absolute judgments.