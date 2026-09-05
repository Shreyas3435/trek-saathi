from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.models import UserRole, VerificationStatus


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: str | None = None


class UserCreate(UserBase):
    password: str = Field(min_length=8)
    role: UserRole = UserRole.TREKKER


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone_number: str | None = None
    profile_image_url: str | None = None


class UserOut(UserBase):
    id: str
    role: UserRole
    profile_image_url: str | None = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class OrganizerProfileBase(BaseModel):
    organization_name: str
    logo_url: str | None = None
    cover_image_url: str | None = None
    about: str | None = None
    website_url: str | None = None
    instagram_url: str | None = None
    contact_email: EmailStr | None = None
    contact_phone: str | None = None


class OrganizerProfileCreate(OrganizerProfileBase):
    pass


class OrganizerProfileUpdate(BaseModel):
    organization_name: str | None = None
    logo_url: str | None = None
    cover_image_url: str | None = None
    about: str | None = None
    website_url: str | None = None
    instagram_url: str | None = None
    contact_email: EmailStr | None = None
    contact_phone: str | None = None


class OrganizerProfileOut(OrganizerProfileBase):
    id: str
    user_id: str
    verification_status: VerificationStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class OrganizerProfileWithRelations(OrganizerProfileOut):
    user: UserOut

    model_config = {"from_attributes": True}


class UserWithRelations(UserOut):
    organizer_profile: OrganizerProfileOut | None = None

    model_config = {"from_attributes": True}


class OrganizerVerificationUpdate(BaseModel):
    verification_status: VerificationStatus
