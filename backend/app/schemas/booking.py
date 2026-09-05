from datetime import datetime

from pydantic import BaseModel, Field

from app.models.models import BookingStatus
from app.schemas.trek import TrekOut
from app.schemas.user import UserOut


class BookingCreate(BaseModel):
    trek_id: str
    num_participants: int = Field(gt=0)
    pickup_location: str | None = None
    special_requests: str | None = None
    contact_phone: str | None = None


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


class BookingOut(BaseModel):
    id: str
    user_id: str
    trek_id: str
    num_participants: int
    pickup_location: str | None = None
    special_requests: str | None = None
    contact_phone: str | None = None
    status: BookingStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BookingWithTrek(BookingOut):
    trek: TrekOut

    model_config = {"from_attributes": True}


class BookingWithUser(BookingOut):
    user: UserOut

    model_config = {"from_attributes": True}


class ReviewCreate(BaseModel):
    trek_id: str
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewResponseUpdate(BaseModel):
    organizer_response: str


class ReviewOut(BaseModel):
    id: str
    user_id: str
    trek_id: str
    rating: int
    comment: str | None = None
    organizer_response: str | None = None
    is_flagged: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewWithUser(ReviewOut):
    user: UserOut

    model_config = {"from_attributes": True}


class ReviewWithUserAndTrek(ReviewWithUser):
    trek: TrekOut

    model_config = {"from_attributes": True}


class WishlistItemOut(BaseModel):
    id: str
    user_id: str
    trek_id: str
    created_at: datetime

    model_config = {"from_attributes": True}


class WishlistItemWithTrek(WishlistItemOut):
    trek: TrekOut

    model_config = {"from_attributes": True}
