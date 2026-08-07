from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import extract, func, or_
from sqlalchemy.orm import Session

from .database import get_db
from .models import Application, ApplicationStatus
from .schemas import (
    ApplicationCreate,
    ApplicationOut,
    ApplicationUpdate,
    DashboardStats,
)

router = APIRouter(prefix="/api/applications", tags=["applications"])

INTERVIEW_STATUSES = {
    ApplicationStatus.interview,
    ApplicationStatus.final_interview,
    ApplicationStatus.offer,
    ApplicationStatus.rejected,
    ApplicationStatus.assessment,
}


@router.get("", response_model=list[ApplicationOut])
def list_applications(
    q: str | None = Query(None),
    status: ApplicationStatus | None = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Application)
    if status:
        query = query.filter(Application.status == status)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Application.company.ilike(like),
                Application.position.ilike(like),
                Application.location.ilike(like),
                Application.notes.ilike(like),
            )
        )
    return query.order_by(Application.updated_at.desc()).all()


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Application.id)).scalar() or 0
    today = date.today()
    this_month = (
        db.query(func.count(Application.id))
        .filter(
            extract("year", Application.date_applied) == today.year,
            extract("month", Application.date_applied) == today.month,
        )
        .scalar()
        or 0
    )
    interviews = (
        db.query(func.count(Application.id))
        .filter(
            Application.status.in_(
                [
                    ApplicationStatus.interview,
                    ApplicationStatus.final_interview,
                ]
            )
        )
        .scalar()
        or 0
    )
    applied_plus = (
        db.query(func.count(Application.id))
        .filter(Application.status != ApplicationStatus.saved)
        .scalar()
        or 0
    )
    responded = (
        db.query(func.count(Application.id))
        .filter(Application.status.in_(list(INTERVIEW_STATUSES)))
        .scalar()
        or 0
    )
    response_rate = round((responded / applied_plus) * 100, 1) if applied_plus else 0.0
    return DashboardStats(
        total_applications=total,
        this_month=this_month,
        interviews=interviews,
        response_rate=response_rate,
    )


@router.get("/{application_id}", response_model=ApplicationOut)
def get_application(application_id: int, db: Session = Depends(get_db)):
    app = db.get(Application, application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.post("", response_model=ApplicationOut, status_code=201)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    app = Application(**payload.model_dump())
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.patch("/{application_id}", response_model=ApplicationOut)
def update_application(
    application_id: int, payload: ApplicationUpdate, db: Session = Depends(get_db)
):
    app = db.get(Application, application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(app, key, value)
    db.commit()
    db.refresh(app)
    return app


@router.delete("/{application_id}", status_code=204)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    app = db.get(Application, application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
