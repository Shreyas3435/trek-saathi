from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.db.session import get_db
from app.models.models import Booking, OrganizerProfile, Review, Trek, User, UserRole, VerificationStatus
from app.schemas.user import OrganizerProfileOut, OrganizerVerificationUpdate, UserOut

router = APIRouter(dependencies=[Depends(require_role(UserRole.ADMIN))])


@router.get("/stats")
def get_platform_stats(db: Session = Depends(get_db)) -> dict:
    return {
        "total_users": db.query(User).count(),
        "total_organizers": db.query(OrganizerProfile).count(),
        "total_treks": db.query(Trek).count(),
        "total_bookings": db.query(Booking).count(),
    }


@router.get("/users", response_model=list[UserOut])
def list_users(role: UserRole | None = None, db: Session = Depends(get_db)) -> list[User]:
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.order_by(User.created_at.desc()).all()


@router.get("/organizers", response_model=list[OrganizerProfileOut])
def list_organizers_for_review(
    verification_status: VerificationStatus | None = None,
    db: Session = Depends(get_db),
) -> list[OrganizerProfile]:
    query = db.query(OrganizerProfile)
    if verification_status:
        query = query.filter(OrganizerProfile.verification_status == verification_status)
    return query.order_by(OrganizerProfile.created_at.desc()).all()


@router.patch("/organizers/{organizer_id}/verification", response_model=OrganizerProfileOut)
def update_organizer_verification(
    organizer_id: str,
    payload: OrganizerVerificationUpdate,
    db: Session = Depends(get_db),
) -> OrganizerProfile:
    organizer = db.get(OrganizerProfile, organizer_id)
    if organizer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer not found")

    organizer.verification_status = payload.verification_status
    db.add(organizer)
    db.commit()
    db.refresh(organizer)
    return organizer


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: str, db: Session = Depends(get_db)) -> None:
    review = db.get(Review, review_id)
    if review is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    db.delete(review)
    db.commit()
