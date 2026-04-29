from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.session import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    category = Column(String(255)) # e.g., Food, Rent, Salary
    type = Column(String(50)) # income or expense
    description = Column(String(255))
    date = Column(DateTime, server_default=func.now())
