"""Populate sample destinations/organizers/treks for local development.

Run from backend/ with the venv active: python -m scripts.seed
"""
from datetime import datetime, timedelta, timezone

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.models import (
    DifficultyLevel,
    Destination,
    OrganizerProfile,
    Trek,
    User,
    UserRole,
    VerificationStatus,
)


def run() -> None:
    db = SessionLocal()
    try:
        if db.query(Destination).first():
            print("Seed data already present, skipping.")
            return

        destinations = [
            Destination(
                name="Kumara Parvatha",
                slug="kumara-parvatha",
                state="Karnataka",
                description="One of the toughest treks in the Western Ghats, through Pushpagiri wildlife sanctuary.",
                cover_image_url="https://images.unsplash.com/photo-1551632811-561732d1e306",
                is_popular=True,
            ),
            Destination(
                name="Kudremukh",
                slug="kudremukh",
                state="Karnataka",
                description="Rolling grasslands and shola forests around the horse-face-shaped peak.",
                cover_image_url="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
                is_popular=True,
            ),
            Destination(
                name="Skandagiri",
                slug="skandagiri",
                state="Karnataka",
                description="A popular night trek near Bangalore, famous for its sunrise above the clouds.",
                cover_image_url="https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
                is_popular=True,
            ),
            Destination(
                name="Kodachadri",
                slug="kodachadri",
                state="Karnataka",
                description="Dense rainforest trek to a peak overlooking the Arabian Sea.",
                cover_image_url="https://images.unsplash.com/photo-1519681393784-d120267933ba",
                is_popular=False,
            ),
            Destination(
                name="Tadiandamol",
                slug="tadiandamol",
                state="Karnataka",
                description="The highest peak in Kodagu, through coffee estates and shola forest.",
                cover_image_url="https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0",
                is_popular=False,
            ),
        ]
        db.add_all(destinations)
        db.flush()

        organizer_user_1 = User(
            email="organizer1@trekplatform.dev",
            hashed_password=hash_password("password123"),
            full_name="Arjun Rao",
            phone_number="9876543210",
            role=UserRole.ORGANIZER,
        )
        organizer_user_2 = User(
            email="organizer2@trekplatform.dev",
            hashed_password=hash_password("password123"),
            full_name="Priya Nair",
            phone_number="9876500000",
            role=UserRole.ORGANIZER,
        )
        trekker_user = User(
            email="trekker@trekplatform.dev",
            hashed_password=hash_password("password123"),
            full_name="Rahul Mehta",
            phone_number="9876511111",
            role=UserRole.TREKKER,
        )
        admin_user = User(
            email="admin@trekplatform.dev",
            hashed_password=hash_password("password123"),
            full_name="Platform Admin",
            role=UserRole.ADMIN,
        )
        db.add_all([organizer_user_1, organizer_user_2, trekker_user, admin_user])
        db.flush()

        organizer_profile_1 = OrganizerProfile(
            user_id=organizer_user_1.id,
            organization_name="Western Ghats Trekkers",
            about="We've been running weekend treks across Karnataka's Western Ghats since 2015.",
            contact_email=organizer_user_1.email,
            contact_phone=organizer_user_1.phone_number,
            verification_status=VerificationStatus.VERIFIED,
        )
        organizer_profile_2 = OrganizerProfile(
            user_id=organizer_user_2.id,
            organization_name="Summit Seekers",
            about="Small-group treks led by certified wilderness guides.",
            contact_email=organizer_user_2.email,
            contact_phone=organizer_user_2.phone_number,
            verification_status=VerificationStatus.PENDING,
        )
        db.add_all([organizer_profile_1, organizer_profile_2])
        db.flush()

        now = datetime.now(timezone.utc)

        treks = [
            Trek(
                organizer_id=organizer_profile_1.id,
                destination_id=destinations[0].id,
                title="Kumara Parvatha Sunrise Trek",
                slug="kumara-parvatha-sunrise-trek",
                trek_date=now + timedelta(days=14),
                duration_days=2,
                difficulty=DifficultyLevel.CHALLENGING,
                price=2499,
                total_seats=20,
                available_seats=14,
                pickup_locations="Bangalore, Mangalore",
                itinerary="Day 1: Trek to Bhattara Mane base camp.\nDay 2: Summit push and descent.",
                inclusions="Guide, camping gear, breakfast and dinner",
                exclusions="Transport, personal trekking gear",
                things_to_carry="Trekking shoes, rain jacket, headlamp",
                cover_image_url="https://images.unsplash.com/photo-1551632811-561732d1e306",
                is_featured=True,
            ),
            Trek(
                organizer_id=organizer_profile_1.id,
                destination_id=destinations[1].id,
                title="Kudremukh Grasslands Trek",
                slug="kudremukh-grasslands-trek",
                trek_date=now + timedelta(days=21),
                duration_days=1,
                difficulty=DifficultyLevel.MODERATE,
                price=1499,
                total_seats=25,
                available_seats=25,
                pickup_locations="Mangalore",
                itinerary="Early morning start, summit by noon, descend by evening.",
                inclusions="Guide, forest permits, lunch",
                exclusions="Transport",
                things_to_carry="Water bottle, cap, trekking shoes",
                cover_image_url="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
                is_featured=True,
            ),
            Trek(
                organizer_id=organizer_profile_2.id,
                destination_id=destinations[2].id,
                title="Skandagiri Night Trek",
                slug="skandagiri-night-trek",
                trek_date=now + timedelta(days=7),
                duration_days=1,
                difficulty=DifficultyLevel.EASY,
                price=799,
                total_seats=40,
                available_seats=32,
                pickup_locations="Bangalore",
                itinerary="Night drive, trek by moonlight, sunrise at the summit.",
                inclusions="Guide, transport from Bangalore, breakfast",
                exclusions="Personal expenses",
                things_to_carry="Torch, warm jacket, water",
                cover_image_url="https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
                is_featured=True,
            ),
            Trek(
                organizer_id=organizer_profile_2.id,
                destination_id=destinations[3].id,
                title="Kodachadri Rainforest Trek",
                slug="kodachadri-rainforest-trek",
                trek_date=now + timedelta(days=28),
                duration_days=2,
                difficulty=DifficultyLevel.MODERATE,
                price=2199,
                total_seats=15,
                available_seats=15,
                pickup_locations="Udupi",
                itinerary="Day 1: Trek to Hidlumane waterfall camp.\nDay 2: Summit and Arabian Sea viewpoint.",
                inclusions="Guide, camping, all meals",
                exclusions="Transport to Udupi",
                things_to_carry="Rain gear, extra socks, torch",
                cover_image_url="https://images.unsplash.com/photo-1519681393784-d120267933ba",
                is_featured=False,
            ),
            Trek(
                organizer_id=organizer_profile_1.id,
                destination_id=destinations[4].id,
                title="Tadiandamol Peak Trek",
                slug="tadiandamol-peak-trek",
                trek_date=now + timedelta(days=35),
                duration_days=1,
                difficulty=DifficultyLevel.MODERATE,
                price=1299,
                total_seats=20,
                available_seats=20,
                pickup_locations="Madikeri",
                itinerary="Trek through coffee estates and shola forest to the highest peak in Kodagu.",
                inclusions="Guide, forest permits",
                exclusions="Transport, meals",
                things_to_carry="Trekking shoes, rain cover",
                cover_image_url="https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0",
                is_featured=False,
            ),
        ]
        db.add_all(treks)
        db.commit()

        print("Seed data created:")
        print(f"  {len(destinations)} destinations")
        print("  2 organizers, 1 trekker, 1 admin (all passwords: password123)")
        print(f"  {len(treks)} treks")
    finally:
        db.close()


if __name__ == "__main__":
    run()
