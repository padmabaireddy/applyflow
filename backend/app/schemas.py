from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from .models import ApplicationStatus


class ApplicationBase(BaseModel):
    company: str = Field(..., min_length=1, max_length=200)
    position: str = Field(..., min_length=1, max_length=200)
    location: Optional[str] = None
    salary: Optional[float] = None
    job_link: Optional[str] = None
    date_applied: Optional[date] = None
    status: ApplicationStatus = ApplicationStatus.saved
    notes: Optional[str] = None
    recruiter_contact: Optional[str] = None
    next_action: Optional[str] = None
    follow_up_date: Optional[date] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company: Optional[str] = Field(None, min_length=1, max_length=200)
    position: Optional[str] = Field(None, min_length=1, max_length=200)
    location: Optional[str] = None
    salary: Optional[float] = None
    job_link: Optional[str] = None
    date_applied: Optional[date] = None
    status: Optional[ApplicationStatus] = None
    notes: Optional[str] = None
    recruiter_contact: Optional[str] = None
    next_action: Optional[str] = None
    follow_up_date: Optional[date] = None


class ApplicationOut(ApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class DashboardStats(BaseModel):
    total_applications: int
    this_month: int
    interviews: int
    response_rate: float
