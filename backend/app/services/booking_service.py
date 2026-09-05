from sqlalchemy.orm import Session

from app.models.models import Booking, BookingStatus, Trek
from app.schemas.booking import BookingCreate


def create_booking_request(db: Session, user_id: str, payload: BookingCreate) -> Booking:
    """Create a pending booking request. Seats are only validated here, not reserved —
    they're decremented on confirmation (see update_booking_status), since a request
    doesn't guarantee a seat until the organizer accepts it."""
    trek = db.get(Trek, payload.trek_id)
    if trek is None or not trek.is_active:
        raise ValueError("Trek not found")
    if trek.available_seats < payload.num_participants:
        raise ValueError("Not enough seats available for this trek")

    booking = Booking(
        user_id=user_id,
        trek_id=payload.trek_id,
        num_participants=payload.num_participants,
        pickup_location=payload.pickup_location,
        special_requests=payload.special_requests,
        contact_phone=payload.contact_phone,
        status=BookingStatus.PENDING,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def update_booking_status(db: Session, booking: Booking, new_status: BookingStatus) -> Booking:
    """Transition a booking's status, adjusting Trek.available_seats to match:
    seats are taken when a booking becomes CONFIRMED, and given back if a
    CONFIRMED booking is later REJECTED or CANCELLED."""
    old_status = booking.status
    trek = booking.trek

    if old_status == new_status:
        return booking

    if new_status == BookingStatus.CONFIRMED:
        if old_status != BookingStatus.PENDING:
            raise ValueError("Only pending bookings can be confirmed")
        if trek.available_seats < booking.num_participants:
            raise ValueError("Not enough seats available to confirm this booking")
        trek.available_seats -= booking.num_participants

    elif new_status in (BookingStatus.REJECTED, BookingStatus.CANCELLED):
        if old_status == BookingStatus.CONFIRMED:
            trek.available_seats += booking.num_participants

    booking.status = new_status
    db.add(trek)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking
