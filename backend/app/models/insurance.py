from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.db.session import Base


class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)

    provider = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # health | vehicle | home | other
    policy_number = Column(String(100), nullable=False)

    premium = Column(Float, nullable=False)
    coverage = Column(Float, nullable=False)
    expiry_date = Column(Date, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
