from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

PolicyType = Literal["health", "vehicle", "home", "other"]


class InsurancePolicyBase(BaseModel):
    provider: str = Field(min_length=1, max_length=200)
    type: PolicyType
    policy_number: str = Field(min_length=1, max_length=100)
    premium: float = Field(gt=0)
    coverage: float = Field(gt=0)
    expiry_date: date


class InsurancePolicyCreate(InsurancePolicyBase):
    pass


class InsurancePolicyUpdate(BaseModel):
    provider: Optional[str] = Field(default=None, min_length=1, max_length=200)
    type: Optional[PolicyType] = None
    policy_number: Optional[str] = Field(default=None, min_length=1, max_length=100)
    premium: Optional[float] = Field(default=None, gt=0)
    coverage: Optional[float] = Field(default=None, gt=0)
    expiry_date: Optional[date] = None


class InsurancePolicy(InsurancePolicyBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
