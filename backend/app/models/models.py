import enum
import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum as SAEnum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class UserRole(str, enum.Enum):
    TREKKER = "trekker"
    ORGANIZER = "organizer"
    ADMIN = "admin"


class VerificationStatus(str, enum.Enum):
    UNVERIFIED = "unverified"
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class DifficultyLevel(str, enum.Enum):
    EASY = "easy"
    MODERATE = "moderate"
    DIFFICULT = "difficult"
    CHALLENGING = "challenging"


class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    role = Column(SAEnum(UserRole, name="user_role"), nullable=False, default=UserRole.TREKKER)
    profile_image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    organizer_profile = relationship(
        "OrganizerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")


class OrganizerProfile(Base):
    __tablename__ = "organizer_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    organization_name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    cover_image_url = Column(String, nullable=True)
    about = Column(Text, nullable=True)
    website_url = Column(String, nullable=True)
    instagram_url = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    verification_status = Column(
        SAEnum(VerificationStatus, name="verification_status"),
        nullable=False,
        default=VerificationStatus.UNVERIFIED,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="organizer_profile")
    treks = relationship("Trek", back_populates="organizer", cascade="all, delete-orphan")


class Destination(Base):
    __tablename__ = "destinations"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    state = Column(String, nullable=False, default="Karnataka")
    description = Column(Text, nullable=True)
    cover_image_url = Column(String, nullable=True)
    is_popular = Column(Boolean, default=False, nullable=False)

    treks = relationship("Trek", back_populates="destination")


class Trek(Base):
    __tablename__ = "treks"

    id = Column(String, primary_key=True, default=generate_uuid)
    organizer_id = Column(String, ForeignKey("organizer_profiles.id"), nullable=False, index=True)
    destination_id = Column(String, ForeignKey("destinations.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    trek_date = Column(DateTime(timezone=True), nullable=False)
    duration_days = Column(Integer, nullable=False)
    difficulty = Column(SAEnum(DifficultyLevel, name="difficulty_level"), nullable=False)
    price = Column(Float, nullable=False)
    total_seats = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False)
    pickup_locations = Column(Text, nullable=True)
    itinerary = Column(Text, nullable=True)
    inclusions = Column(Text, nullable=True)
    exclusions = Column(Text, nullable=True)
    things_to_carry = Column(Text, nullable=True)
    cover_image_url = Column(String, nullable=True)
    # Comma-separated list of image URLs. MVP-simple: no dedicated media table (see architecture notes).
    gallery_image_urls = Column(Text, nullable=True)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    organizer = relationship("OrganizerProfile", back_populates="treks")
    destination = relationship("Destination", back_populates="treks")
    bookings = relationship("Booking", back_populates="trek", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="trek", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="trek", cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    trek_id = Column(String, ForeignKey("treks.id"), nullable=False, index=True)
    num_participants = Column(Integer, nullable=False, default=1)
    pickup_location = Column(String, nullable=True)
    special_requests = Column(Text, nullable=True)
    contact_phone = Column(String, nullable=True)
    status = Column(SAEnum(BookingStatus, name="booking_status"), nullable=False, default=BookingStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="bookings")
    trek = relationship("Trek", back_populates="bookings")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    trek_id = Column(String, ForeignKey("treks.id"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    organizer_response = Column(Text, nullable=True)
    is_flagged = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="reviews")
    trek = relationship("Trek", back_populates="reviews")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    __table_args__ = (UniqueConstraint("user_id", "trek_id", name="uq_wishlist_user_trek"),)

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    trek_id = Column(String, ForeignKey("treks.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="wishlist_items")
    trek = relationship("Trek", back_populates="wishlist_items")
