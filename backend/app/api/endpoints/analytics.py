from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.transaction import Transaction
from app.services.analysis import AnalysisService
from app.services.classification import ClassificationService
from app.services.health_score import HealthScoreService
from app.schemas.analytics import FinancialHealthScore, UserClassification
from datetime import datetime

router = APIRouter()

@router.get("/health-score", response_model=FinancialHealthScore)
def get_health_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all transactions for the user
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    
    savings_ratio = (total_income - total_expense) / total_income if total_income > 0 else 0
    
    return HealthScoreService.calculate_score(total_income, total_expense, savings_ratio)

@router.get("/classification", response_model=UserClassification)
def get_user_classification(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    
    # Simple category aggregation
    categories = {}
    for t in transactions:
        if t.type == "expense":
            categories[t.category] = categories.get(t.category, 0) + t.amount
            
    return ClassificationService.classify_user(total_income, total_expense, categories)
