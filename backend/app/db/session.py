import os
from pathlib import Path
from typing import Optional
from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def _load_local_env_if_needed() -> None:
    """
    Keep Render/production env vars authoritative.
    We only load backend/.env when DATABASE_URL is not already provided.
    """
    env_file = Path(__file__).resolve().parents[2] / ".env"
    if os.getenv("DATABASE_URL"):
        return
    if env_file.exists():
        load_dotenv(env_file)


def _normalize_postgres_url(database_url: str) -> str:
    """
    - SQLAlchemy 2 + psycopg expects an explicit `postgresql+psycopg://` scheme.
    - Render/Postgres commonly requires TLS/SSL; we add `sslmode=require`
      when the host is not local and sslmode isn't already present.
    """
    url = database_url.strip()

    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)

    if not url.startswith(("postgresql+psycopg://", "postgresql+psycopg2://")):
        return url

    parts = urlsplit(url)
    query = parse_qs(parts.query, keep_blank_values=True)
    query.setdefault("sslmode", [])

    # Respect any explicit sslmode in the URL.
    if query.get("sslmode"):
        sslmode = query["sslmode"][0]
        if sslmode:
            return url

    explicit_sslmode = os.getenv("POSTGRES_SSLMODE")
    if explicit_sslmode:
        query["sslmode"] = [explicit_sslmode]
    else:
        # Avoid forcing TLS for local Postgres.
        host = parts.hostname or ""
        if host not in ("localhost", "127.0.0.1", "::1"):
            query["sslmode"] = ["require"]

    new_query = urlencode(query, doseq=True)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, new_query, parts.fragment))


def _build_database_url() -> str:
    _load_local_env_if_needed()

    database_url = os.getenv("DATABASE_URL")
    if database_url:
        database_url = _normalize_postgres_url(database_url)
        return database_url

    # Local fallback (when DATABASE_URL isn't provided).
    # Prefer sqlite for minimal friction.
    db_type = os.getenv("DB_TYPE", "sqlite").lower()
    if db_type == "sqlite":
        sqlite_path = os.getenv(
            "SQLITE_PATH",
            str(Path(__file__).resolve().parents[2] / "dev.sqlite"),
        )
        return f"sqlite:///{sqlite_path}"

    if db_type == "postgres":
        db_user = os.getenv("DB_USER", "postgres")
        db_password = os.getenv("DB_PASSWORD", "")
        db_host = os.getenv("DB_HOST", "localhost")
        db_port = os.getenv("DB_PORT", "5432")
        db_name = os.getenv("DB_NAME", "expense_tracker")
        password_part = f":{db_password}" if db_password else ""
        url = f"postgresql+psycopg://{db_user}{password_part}@{db_host}:{db_port}/{db_name}"
        return _normalize_postgres_url(url)

    raise ValueError("DATABASE_URL is not set (and no supported local DB config was provided).")


SQLALCHEMY_DATABASE_URL = _build_database_url()

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a SQLAlchemy session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
