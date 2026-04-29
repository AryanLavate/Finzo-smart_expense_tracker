from pydantic import BaseModel
from typing import List, Dict

class FinancialInsight(BaseModel):
    title: str
    message: str
    type: str # info, warning, success

class BehaviorAnalysis(BaseModel):
    month_over_month_change: float
    top_spending_categories: Dict[str, float]
    savings_ratio: float
    status: str

class UserClassification(BaseModel):
    category: str
    explanation: str

class FinancialHealthScore(BaseModel):
    score: int
    rating: str # Poor, Fair, Good, Excellent
    factors: List[str]
