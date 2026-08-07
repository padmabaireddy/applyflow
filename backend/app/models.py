import enum
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, Float, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class ApplicationStatus(str, enum.Enum):
    saved = "Saved"
    applied = "Applied"
    assessment = "Assessment"
    interview = "Interview"
    final_interview = "Final Interview"
    offer = "Offer"
    rejected = "Rejected"


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company: Mapped[str] = mapped_column(String(200), nullable=False)
    position: Mapped[str] = mapped_column(String(200), nullable=False)
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    salary: Mapped[float | None] = mapped_column(Float, nullable=True)
    job_link: Mapped[str | None] = mapped_column(String(500), nullable=True)
    date_applied: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(
            ApplicationStatus,
            native_enum=False,
            values_callable=lambda x: [e.value for e in x],
        ),
        default=ApplicationStatus.saved,
        nullable=False,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    recruiter_contact: Mapped[str | None] = mapped_column(String(300), nullable=True)
    next_action: Mapped[str | None] = mapped_column(String(300), nullable=True)
    follow_up_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
