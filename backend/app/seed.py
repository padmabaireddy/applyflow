from datetime import date, timedelta

from .models import Application, ApplicationStatus


SEED_APPS = [
    {
        "company": "Waymark",
        "position": "Software Engineer",
        "location": "Remote",
        "salary": 145000,
        "date_applied": date.today() - timedelta(days=12),
        "status": ApplicationStatus.applied,
        "notes": "Demo sample — fictional data",
        "next_action": "Send thank-you note",
        "follow_up_date": date.today() + timedelta(days=2),
        "recruiter_contact": "alex@example.com",
    },
    {
        "company": "Google",
        "position": "SWE",
        "location": "Mountain View, CA",
        "salary": 180000,
        "date_applied": date.today() - timedelta(days=20),
        "status": ApplicationStatus.assessment,
        "notes": "Online assessment scheduled",
        "next_action": "Complete OA",
        "follow_up_date": date.today() - timedelta(days=1),
        "recruiter_contact": "recruiter@example.com",
    },
    {
        "company": "Company X",
        "position": "Backend Engineer",
        "location": "Austin, TX",
        "salary": 155000,
        "date_applied": date.today() - timedelta(days=8),
        "status": ApplicationStatus.interview,
        "notes": "Phone screen done",
        "next_action": "Prep system design",
        "follow_up_date": date.today() + timedelta(days=5),
    },
    {
        "company": "Stripe",
        "position": "Full Stack Engineer",
        "location": "Remote",
        "salary": 170000,
        "date_applied": date.today() - timedelta(days=3),
        "status": ApplicationStatus.saved,
        "notes": "Tailor resume before applying",
        "next_action": "Apply this week",
        "follow_up_date": date.today() + timedelta(days=1),
    },
    {
        "company": "Notion",
        "position": "Frontend Engineer",
        "location": "San Francisco, CA",
        "salary": 160000,
        "date_applied": date.today() - timedelta(days=30),
        "status": ApplicationStatus.final_interview,
        "notes": "Final round with hiring manager",
        "next_action": "Review portfolio",
        "follow_up_date": date.today(),
    },
    {
        "company": "Airbnb",
        "position": "Software Engineer",
        "location": "Remote",
        "salary": 175000,
        "date_applied": date.today() - timedelta(days=45),
        "status": ApplicationStatus.offer,
        "notes": "Offer received — evaluating",
        "next_action": "Compare total comp",
        "follow_up_date": date.today() + timedelta(days=7),
    },
    {
        "company": "Meta",
        "position": "SWE Intern",
        "location": "Menlo Park, CA",
        "salary": 90000,
        "date_applied": date.today() - timedelta(days=40),
        "status": ApplicationStatus.rejected,
        "notes": "Rejected after OA",
        "next_action": None,
        "follow_up_date": None,
    },
    {
        "company": "Shopify",
        "position": "Backend Developer",
        "location": "Toronto, ON",
        "salary": 140000,
        "date_applied": date.today() - timedelta(days=5),
        "status": ApplicationStatus.applied,
        "notes": "Applied via careers page",
        "next_action": "Follow up if no reply",
        "follow_up_date": date.today() + timedelta(days=9),
        "recruiter_contact": "talent@example.com",
    },
]


def seed_if_empty(db) -> int:
    if db.query(Application).count() > 0:
        return 0
    for row in SEED_APPS:
        db.add(Application(**row))
    db.commit()
    return len(SEED_APPS)
