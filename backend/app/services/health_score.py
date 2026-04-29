from app.schemas.analytics import FinancialHealthScore

class HealthScoreService:
    @staticmethod
    def calculate_score(income: float, expense: float, savings_ratio: float) -> FinancialHealthScore:
        score = 0
        factors = []
        
        # Savings Ratio Factor (Max 40 points)
        if savings_ratio >= 0.3:
            score += 40
            factors.append("Excellent savings ratio (>30%)")
        elif savings_ratio >= 0.1:
            score += 20
            factors.append("Good savings ratio (>10%)")
        else:
            factors.append("Low savings ratio - try to save at least 20%")
            
        # Income-Expense Balance (Max 40 points)
        if income > expense:
            score += 40
            factors.append("Positive cash flow (Income > Expenses)")
        else:
            factors.append("Negative cash flow - you are spending more than you earn")
            
        # Stability Factor (Placeholder for consistency - Max 20 points)
        score += 20 
        factors.append("Consistent record keeping")
        
        rating = "Poor"
        if score > 80: rating = "Excellent"
        elif score > 60: rating = "Good"
        elif score > 40: rating = "Fair"
        
        return FinancialHealthScore(
            score=score,
            rating=rating,
            factors=factors
        )
