from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.deps import require_role
from app.db.session import get_db
from app.models.models import DifficultyLevel, OrganizerProfile, Trek, User, UserRole
from app.schemas.trek import TrekCreate, TrekOut, TrekUpdate, TrekWithRelations

router = APIRouter()


def _get_organizer_profile_or_404(db: Session, user: User) -> OrganizerProfile:
    organizer_profile = db.query(OrganizerProfile).filter(OrganizerProfile.user_id == user.id).first()
    if organizer_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer profile not found. Complete organizer onboarding first.",
        )
    return organizer_profile


def _get_owned_trek_or_404(db: Session, user: User, trek_id: str) -> Trek:
    trek = db.get(Trek, trek_id)
    if trek is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trek not found")

    organizer_profile = _get_organizer_profile_or_404(db, user)
    if trek.organizer_id != organizer_profile.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this trek")

    return trek


@router.get("", response_model=list[TrekOut])
def list_treks(
    destination_id: str | None = None,
    organizer_id: str | None = None,
    difficulty: DifficultyLevel | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    is_featured: bool | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
) -> list[Trek]:
    query = db.query(Trek).filter(Trek.is_active.is_(True))

    if destination_id:
        query = query.filter(Trek.destination_id == destination_id)
    if organizer_id:
        query = query.filter(Trek.organizer_id == organizer_id)
    if difficulty:
        query = query.filter(Trek.difficulty == difficulty)
    if min_price is not None:
        query = query.filter(Trek.price >= min_price)
    if max_price is not None:
        query = query.filter(Trek.price <= max_price)
    if is_featured is not None:
        query = query.filter(Trek.is_featured.is_(is_featured))
    if search:
        query = query.filter(Trek.title.ilike(f"%{search}%"))

    return query.order_by(Trek.trek_date.asc()).all()


@router.get("/organizer/mine", response_model=list[TrekOut])
def list_my_treks(
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> list[Trek]:
    organizer_profile = _get_organizer_profile_or_404(db, current_user)
    return (
        db.query(Trek)
        .filter(Trek.organizer_id == organizer_profile.id)
        .order_by(Trek.created_at.desc())
        .all()
    )


@router.get("/{slug}", response_model=TrekWithRelations)
def get_trek(slug: str, db: Session = Depends(get_db)) -> Trek:
    trek = (
        db.query(Trek)
        .options(joinedload(Trek.organizer), joinedload(Trek.destination))
        .filter(Trek.slug == slug)
        .first()
    )
    if trek is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trek not found")
    return trek


@router.post("", response_model=TrekOut, status_code=status.HTTP_201_CREATED)
def create_trek(
    payload: TrekCreate,
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> Trek:
    organizer_profile = _get_organizer_profile_or_404(db, current_user)

    existing = db.query(Trek).filter(Trek.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A trek with this slug already exists")

    trek = Trek(
        organizer_id=organizer_profile.id,
        available_seats=payload.total_seats,
        **payload.model_dump(),
    )
    db.add(trek)
    db.commit()
    db.refresh(trek)
    return trek


@router.patch("/{trek_id}", response_model=TrekOut)
def update_trek(
    trek_id: str,
    payload: TrekUpdate,
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> Trek:
    trek = _get_owned_trek_or_404(db, current_user, trek_id)

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(trek, field, value)

    db.add(trek)
    db.commit()
    db.refresh(trek)
    return trek


@router.delete("/{trek_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trek(
    trek_id: str,
    current_user: User = Depends(require_role(UserRole.ORGANIZER)),
    db: Session = Depends(get_db),
) -> None:
    trek = _get_owned_trek_or_404(db, current_user, trek_id)
    db.delete(trek)
    db.commit()
