import pytest

from app.models.models import BookingStatus
from app.schemas.booking import BookingCreate
from app.services import booking_service


def test_create_booking_request_succeeds_when_seats_available(db_session, sample_trek):
    trek = sample_trek["trek"]
    trekker = sample_trek["trekker"]

    booking = booking_service.create_booking_request(
        db_session, trekker.id, BookingCreate(trek_id=trek.id, num_participants=3)
    )

    assert booking.status == BookingStatus.PENDING
    assert booking.num_participants == 3
    assert trek.available_seats == 10  # unchanged until confirmed


def test_create_booking_request_fails_when_not_enough_seats(db_session, sample_trek):
    trek = sample_trek["trek"]
    trekker = sample_trek["trekker"]

    with pytest.raises(ValueError):
        booking_service.create_booking_request(
            db_session, trekker.id, BookingCreate(trek_id=trek.id, num_participants=11)
        )


def test_confirming_a_booking_decrements_available_seats(db_session, sample_trek):
    trek = sample_trek["trek"]
    trekker = sample_trek["trekker"]

    booking = booking_service.create_booking_request(
        db_session, trekker.id, BookingCreate(trek_id=trek.id, num_participants=4)
    )
    updated = booking_service.update_booking_status(db_session, booking, BookingStatus.CONFIRMED)

    assert updated.status == BookingStatus.CONFIRMED
    assert trek.available_seats == 6


def test_confirming_fails_when_seats_run_out_between_requests(db_session, sample_trek):
    trek = sample_trek["trek"]
    trekker = sample_trek["trekker"]

    first = booking_service.create_booking_request(
        db_session, trekker.id, BookingCreate(trek_id=trek.id, num_participants=6)
    )
    second = booking_service.create_booking_request(
        db_session, trekker.id, BookingCreate(trek_id=trek.id, num_participants=6)
    )

    booking_service.update_booking_status(db_session, first, BookingStatus.CONFIRMED)
    assert trek.available_seats == 4

    with pytest.raises(ValueError):
        booking_service.update_booking_status(db_session, second, BookingStatus.CONFIRMED)


def test_rejecting_a_confirmed_booking_restores_seats(db_session, sample_trek):
    trek = sample_trek["trek"]
    trekker = sample_trek["trekker"]

    booking = booking_service.create_booking_request(
        db_session, trekker.id, BookingCreate(trek_id=trek.id, num_participants=5)
    )
    booking_service.update_booking_status(db_session, booking, BookingStatus.CONFIRMED)
    assert trek.available_seats == 5

    booking_service.update_booking_status(db_session, booking, BookingStatus.CANCELLED)
    assert trek.available_seats == 10


def test_rejecting_a_pending_booking_does_not_touch_seats(db_session, sample_trek):
    trek = sample_trek["trek"]
    trekker = sample_trek["trekker"]

    booking = booking_service.create_booking_request(
        db_session, trekker.id, BookingCreate(trek_id=trek.id, num_participants=3)
    )
    booking_service.update_booking_status(db_session, booking, BookingStatus.REJECTED)

    assert trek.available_seats == 10


def test_cannot_reconfirm_a_non_pending_booking(db_session, sample_trek):
    trek = sample_trek["trek"]
    trekker = sample_trek["trekker"]

    booking = booking_service.create_booking_request(
        db_session, trekker.id, BookingCreate(trek_id=trek.id, num_participants=2)
    )
    booking_service.update_booking_status(db_session, booking, BookingStatus.REJECTED)

    with pytest.raises(ValueError):
        booking_service.update_booking_status(db_session, booking, BookingStatus.CONFIRMED)
