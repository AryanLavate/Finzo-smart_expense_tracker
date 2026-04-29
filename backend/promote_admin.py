from app.db.session import SessionLocal
from app.models.user import User

def promote_user_to_admin(email: str):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print(f"User {email} not found.")
        db.close()
        return

    user.role = "admin"
    db.commit()
    print(f"User {email} has been promoted to admin.")
    db.close()

if __name__ == "__main__":
    promote_user_to_admin("aryanlavate666@gmail.com")    # here is ADMIN email