import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# Load backend/.env for local development and prefer it over machine env vars.
load_dotenv(Path(__file__).resolve().parents[2] / ".env", override=True)


def _build_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        if database_url.startswith("mysql://"):
            # SQLAlchemy 2 expects explicit driver for MySQL URLs.
            return database_url.replace("mysql://", "mysql+pymysql://", 1)
        if database_url.startswith("postgres://"):
            # Common managed providers still return postgres://.
            return database_url.replace("postgres://", "postgresql+psycopg://", 1)
        if database_url.startswith("postgresql://"):
            # Use psycopg driver explicitly for SQLAlchemy 2.
            return database_url.replace("postgresql://", "postgresql+psycopg://", 1)
        return database_url

    db_user = os.getenv("DB_USER", "rrot")
    db_password = os.getenv("DB_PASSWORD", "")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "3306")
    db_name = os.getenv("DB_NAME", "expense_tracker")
    return f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"


SQLALCHEMY_DATABASE_URL = _build_database_url()

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
