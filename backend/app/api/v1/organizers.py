from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.core.deps import require_role
from app.db.session import get_db
from app.models.models import Booking, BookingStatus, OrganizerProfile, Review, Trek, User, UserRole
from app.schemas.booking import ReviewWithUserAndTrek
from app.schemas.user import OrganizerProfileCreate, OrganizerProfileOut, OrganizerProfileUpdate

router = APIRouter()


@router.get("", response_model=list[OrganizerProfileOut])
def list_organizers(db: Session = Depends(get_db)) -> list[OrganizerProfile]:
    return db.query(OrganizerProfile).order_by(OrganizerProfile.organization_name.asc()).all()


@router.get("/me/stats")
def get_my_organizer_stats(
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> dict:
    profile = db.query(OrganizerProfile).filter(OrganizerProfile.user_id == current_user.id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer profile not found")

    trek_ids = [row[0] for row in db.query(Trek.id).filter(Trek.organizer_id == profile.id).all()]

    pending_booking_requests = 0
    average_rating = None
    if trek_ids:
        pending_booking_requests = (
            db.query(Booking)
            .filter(Booking.trek_id.in_(trek_ids), Booking.status == BookingStatus.PENDING)
            .count()
        )
        avg_rating_row = db.query(func.avg(Review.rating)).filter(Review.trek_id.in_(trek_ids)).scalar()
        average_rating = round(avg_rating_row, 2) if avg_rating_row is not None else None

    return {
        "total_treks": len(trek_ids),
        "pending_booking_requests": pending_booking_requests,
        "average_rating": average_rating,
    }


@router.get("/me/reviews", response_model=list[ReviewWithUserAndTrek])
def get_my_organizer_reviews(
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> list[Review]:
    profile = db.query(OrganizerProfile).filter(OrganizerProfile.user_id == current_user.id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer profile not found")

    return (
        db.query(Review)
        .join(Trek, Review.trek_id == Trek.id)
        .options(joinedload(Review.user), joinedload(Review.trek))
        .filter(Trek.organizer_id == profile.id)
        .order_by(Review.created_at.desc())
        .all()
    )


@router.get("/{organizer_id}", response_model=OrganizerProfileOut)
def get_organizer(organizer_id: str, db: Session = Depends(get_db)) -> OrganizerProfile:
    organizer = db.get(OrganizerProfile, organizer_id)
    if organizer is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer not found")
    return organizer


@router.post("/me", response_model=OrganizerProfileOut, status_code=status.HTTP_201_CREATED)
def create_my_organizer_profile(
    payload: OrganizerProfileCreate,
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> OrganizerProfile:
    existing = db.query(OrganizerProfile).filter(OrganizerProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Organizer profile already exists")

    profile = OrganizerProfile(user_id=current_user.id, **payload.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.patch("/me", response_model=OrganizerProfileOut)
def update_my_organizer_profile(
    payload: OrganizerProfileUpdate,
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> OrganizerProfile:
    profile = db.query(OrganizerProfile).filter(OrganizerProfile.user_id == current_user.id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer profile not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
