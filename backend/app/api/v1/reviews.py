from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.deps import require_role
from app.db.session import get_db
from app.models.models import Booking, BookingStatus, OrganizerProfile, Review, Trek, User, UserRole
from app.schemas.booking import ReviewCreate, ReviewResponseUpdate, ReviewWithUser

router = APIRouter()


@router.get("/trek/{trek_id}", response_model=list[ReviewWithUser])
def get_reviews_for_trek(trek_id: str, db: Session = Depends(get_db)) -> list[Review]:
    return (
        db.query(Review)
        .options(joinedload(Review.user))
        .filter(Review.trek_id == trek_id, Review.is_flagged.is_(False))
        .order_by(Review.created_at.desc())
        .all()
    )


@router.post("", response_model=ReviewWithUser, status_code=status.HTTP_201_CREATED)
def create_review(
    payload: ReviewCreate,
    current_user: User = Depends(require_role(UserRole.TREKKER)),
    db: Session = Depends(get_db),
) -> Review:
    has_confirmed_booking = (
        db.query(Booking)
        .filter(
            Booking.user_id == current_user.id,
            Booking.trek_id == payload.trek_id,
            Booking.status == BookingStatus.CONFIRMED,
        )
        .first()
    )
    if not has_confirmed_booking:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only review a trek after a confirmed booking",
        )

    existing_review = (
        db.query(Review)
        .filter(Review.user_id == current_user.id, Review.trek_id == payload.trek_id)
        .first()
    )
    if existing_review:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You already reviewed this trek")

    review = Review(user_id=current_user.id, trek_id=payload.trek_id, rating=payload.rating, comment=payload.comment)
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.patch("/{review_id}/response", response_model=ReviewWithUser)
def respond_to_review(
    review_id: str,
    payload: ReviewResponseUpdate,
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> Review:
    review = db.query(Review).options(joinedload(Review.user)).filter(Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    trek = db.get(Trek, review.trek_id)
    organizer_profile = db.query(OrganizerProfile).filter(OrganizerProfile.user_id == current_user.id).first()
    if organizer_profile is None or trek.organizer_id != organizer_profile.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this trek's review")

    review.organizer_response = payload.organizer_response
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
