from app.db.session import engine, Base
from app.models.user import User
from app.models.transaction import Transaction
from app.models.insurance import InsurancePolicy

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    init_db()
