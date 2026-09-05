from datetime import datetime

from pydantic import BaseModel, Field

from app.models.models import DifficultyLevel
from app.schemas.user import OrganizerProfileOut


class DestinationOut(BaseModel):
    id: str
    name: str
    slug: str
    state: str
    description: str | None = None
    cover_image_url: str | None = None
    is_popular: bool

    model_config = {"from_attributes": True}


class TrekBase(BaseModel):
    title: str
    destination_id: str
    trek_date: datetime
    duration_days: int = Field(gt=0)
    difficulty: DifficultyLevel
    price: float = Field(ge=0)
    total_seats: int = Field(gt=0)
    pickup_locations: str | None = None
    itinerary: str | None = None
    inclusions: str | None = None
    exclusions: str | None = None
    things_to_carry: str | None = None
    cover_image_url: str | None = None
    gallery_image_urls: str | None = None
    is_featured: bool = False
    is_active: bool = True


class TrekCreate(TrekBase):
    slug: str


class TrekUpdate(BaseModel):
    title: str | None = None
    destination_id: str | None = None
    trek_date: datetime | None = None
    duration_days: int | None = Field(default=None, gt=0)
    difficulty: DifficultyLevel | None = None
    price: float | None = Field(default=None, ge=0)
    total_seats: int | None = Field(default=None, gt=0)
    available_seats: int | None = Field(default=None, ge=0)
    pickup_locations: str | None = None
    itinerary: str | None = None
    inclusions: str | None = None
    exclusions: str | None = None
    things_to_carry: str | None = None
    cover_image_url: str | None = None
    gallery_image_urls: str | None = None
    is_featured: bool | None = None
    is_active: bool | None = None


class TrekOut(TrekBase):
    id: str
    organizer_id: str
    slug: str
    available_seats: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TrekWithRelations(TrekOut):
    organizer: OrganizerProfileOut
    destination: DestinationOut

    model_config = {"from_attributes": True}
