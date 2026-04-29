from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.user import User as UserSchema
from app.core.security import get_current_user

router = APIRouter()

async def get_current_active_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges"
        )
    return current_user

@router.get("/users", response_model=List[UserSchema])
def get_users(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_active_admin)
):
    """
    Get all users (Admin only)
    """
    return db.query(User).all()

@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_active_admin)
):
    """
    Update user role (Admin only)
    """
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.role = role
    db.commit()
    return {"message": f"User role updated to {role}"}

@router.put("/users/{user_id}/toggle-status")
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_active_admin)
):
    """
    Toggle user active status (Admin only)
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't let admin deactivate themselves
    if user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")

    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User status toggled to {user.is_active}"}

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_active_admin)
):
    """
    Get system-wide stats (Admin only)
    """
    total_users = db.query(User).count()
    total_transactions = db.query(Transaction).count()
    total_volume = db.query(func.sum(Transaction.amount)).scalar() or 0
    
    # Get user growth (last 5 users)
    recent_users = db.query(User).order_by(User.id.desc()).limit(5).all()
    recent_users_list = [{"email": u.email, "full_name": u.full_name} for u in recent_users]

    return {
        "total_users": total_users,
        "total_transactions": total_transactions,
        "total_volume": float(total_volume),
        "recent_users": recent_users_list
    }
