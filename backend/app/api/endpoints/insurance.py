from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.insurance import InsurancePolicy
from app.models.user import User
from app.schemas.insurance import (
    InsurancePolicyCreate,
    InsurancePolicyUpdate,
    InsurancePolicy as InsurancePolicySchema,
)

router = APIRouter()


@router.get("/", response_model=List[InsurancePolicySchema])
def list_policies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(InsurancePolicy)
        .filter(InsurancePolicy.user_id == current_user.id)
        .order_by(InsurancePolicy.expiry_date.asc())
        .all()
    )


@router.post("/", response_model=InsurancePolicySchema)
def create_policy(
    policy: InsurancePolicyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_policy = InsurancePolicy(**policy.model_dump(), user_id=current_user.id)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy


@router.put("/{policy_id}", response_model=InsurancePolicySchema)
def update_policy(
    policy_id: int,
    policy: InsurancePolicyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_policy = (
        db.query(InsurancePolicy)
        .filter(InsurancePolicy.id == policy_id, InsurancePolicy.user_id == current_user.id)
        .first()
    )
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    update_data = policy.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_policy, key, value)

    db.commit()
    db.refresh(db_policy)
    return db_policy


@router.delete("/{policy_id}")
def delete_policy(
    policy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_policy = (
        db.query(InsurancePolicy)
        .filter(InsurancePolicy.id == policy_id, InsurancePolicy.user_id == current_user.id)
        .first()
    )
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    db.delete(db_policy)
    db.commit()
    return {"message": "Policy deleted successfully"}
