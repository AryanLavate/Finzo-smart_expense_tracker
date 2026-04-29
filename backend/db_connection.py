import os
import psycopg
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_connection():
    try:
        database_url = os.getenv("DATABASE_URL")

        if not database_url:
            raise ValueError("DATABASE_URL not found in .env file")

        # Connect to PostgreSQL
        conn = psycopg.connect(database_url)

        print("✅ Database connected successfully!")
        return conn

    except Exception as e:
        print("❌ Database connection failed:")
        print(e)
        return None


def test_query():
    conn = get_connection()

    if conn is None:
        return

    try:
        with conn.cursor() as cur:
            # Simple test query
            cur.execute("SELECT version();")
            result = cur.fetchone()

            print("📦 PostgreSQL version:")
            print(result[0])

    except Exception as e:
        print("❌ Query failed:")
        print(e)

    finally:
        conn.close()
        print("🔌 Connection closed")


if __name__ == "__main__":
    test_query()