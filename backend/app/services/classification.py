from app.schemas.analytics import UserClassification

class ClassificationService:
    """
    This service implements the rule-based classification logic.
    Viva Tip: Explain that this is a 'Deterministic Expert System' that uses
    predefined financial rules to categorize users.
    """
    @staticmethod
    def classify_user(income: float, expense: float, categories: dict) -> UserClassification:
        savings_ratio = (income - expense) / income if income > 0 else -1
        
        # Rule 1: Financial Risk
        if expense > income:
            return UserClassification(
                category="Financial Risk User",
                explanation="Your expenses consistently exceed your income. This is a high-risk pattern."
            )
        
        # Rule 2: Impulsive Spender (High non-essential spending)
        # Assuming 'Entertainment' and 'Shopping' are non-essential
        non_essential = categories.get("Entertainment", 0) + categories.get("Shopping", 0)
        if non_essential > (expense * 0.4):
            return UserClassification(
                category="Impulsive Spender",
                explanation="More than 40% of your spending goes to non-essential categories like Entertainment and Shopping."
            )
        
        # Rule 3: Fixed-Expense Heavy
        fixed = categories.get("Rent", 0) + categories.get("Bills", 0)
        if fixed > (expense * 0.6):
            return UserClassification(
                category="Fixed-Expense Heavy User",
                explanation="A large portion of your income is consumed by fixed costs like Rent and Bills."
            )
        
        # Default: Balanced Spender
        return UserClassification(
            category="Balanced Spender",
            explanation="You maintain a healthy balance between income, essential expenses, and savings."
        )
