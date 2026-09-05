from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.deps import require_role
from app.db.session import get_db
from app.models.models import Booking, OrganizerProfile, Trek, User, UserRole
from app.schemas.booking import BookingCreate, BookingOut, BookingStatusUpdate, BookingWithTrek, BookingWithUser
from app.services import booking_service

router = APIRouter()


@router.post("", response_model=BookingWithTrek, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    current_user: User = Depends(require_role(UserRole.TREKKER)),
    db: Session = Depends(get_db),
) -> Booking:
    try:
        booking = booking_service.create_booking_request(db, current_user.id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return (
        db.query(Booking)
        .options(joinedload(Booking.trek))
        .filter(Booking.id == booking.id)
        .first()
    )


@router.get("/my-bookings", response_model=list[BookingWithTrek])
def get_my_bookings(
    current_user: User = Depends(require_role(UserRole.TREKKER)),
    db: Session = Depends(get_db),
) -> list[Booking]:
    return (
        db.query(Booking)
        .options(joinedload(Booking.trek))
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )


@router.get("/organizer/requests", response_model=list[BookingWithUser])
def get_organizer_booking_requests(
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> list[Booking]:
    organizer_profile = db.query(OrganizerProfile).filter(OrganizerProfile.user_id == current_user.id).first()
    if organizer_profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer profile not found")

    return (
        db.query(Booking)
        .join(Trek, Booking.trek_id == Trek.id)
        .options(joinedload(Booking.user))
        .filter(Trek.organizer_id == organizer_profile.id)
        .order_by(Booking.created_at.desc())
        .all()
    )


@router.patch("/{booking_id}/status", response_model=BookingOut)
def update_booking_status(
    booking_id: str,
    payload: BookingStatusUpdate,
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> Booking:
    booking = db.query(Booking).options(joinedload(Booking.trek)).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    organizer_profile = db.query(OrganizerProfile).filter(OrganizerProfile.user_id == current_user.id).first()
    if organizer_profile is None or booking.trek.organizer_id != organizer_profile.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this booking's trek")

    try:
        return booking_service.update_booking_status(db, booking, payload.status)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
