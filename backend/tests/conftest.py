from datetime import datetime, timezone

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.models.models import (
    DifficultyLevel,
    Destination,
    OrganizerProfile,
    Trek,
    User,
    UserRole,
    VerificationStatus,
)


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine)
    session = session_factory()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def sample_trek(db_session):
    organizer_user = User(
        email="organizer@test.dev",
        hashed_password="x",
        full_name="Test Organizer",
        role=UserRole.ORGANIZER,
    )
    trekker_user = User(
        email="trekker@test.dev",
        hashed_password="x",
        full_name="Test Trekker",
        role=UserRole.TREKKER,
    )
    db_session.add_all([organizer_user, trekker_user])
    db_session.flush()

    organizer_profile = OrganizerProfile(
        user_id=organizer_user.id,
        organization_name="Test Org",
        verification_status=VerificationStatus.VERIFIED,
    )
    destination = Destination(name="Test Peak", slug="test-peak")
    db_session.add_all([organizer_profile, destination])
    db_session.flush()

    trek = Trek(
        organizer_id=organizer_profile.id,
        destination_id=destination.id,
        title="Test Trek",
        slug="test-trek",
        trek_date=datetime.now(timezone.utc),
        duration_days=1,
        difficulty=DifficultyLevel.EASY,
        price=1000,
        total_seats=10,
        available_seats=10,
    )
    db_session.add(trek)
    db_session.flush()

    return {"trek": trek, "trekker": trekker_user, "organizer_user": organizer_user}
