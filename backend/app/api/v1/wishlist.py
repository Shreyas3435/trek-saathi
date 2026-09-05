from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.deps import require_role
from app.db.session import get_db
from app.models.models import Trek, User, UserRole, WishlistItem
from app.schemas.booking import WishlistItemWithTrek

router = APIRouter()


@router.get("", response_model=list[WishlistItemWithTrek])
def get_wishlist(
    current_user: User = Depends(require_role(UserRole.TREKKER)),
    db: Session = Depends(get_db),
) -> list[WishlistItem]:
    return (
        db.query(WishlistItem)
        .options(joinedload(WishlistItem.trek))
        .filter(WishlistItem.user_id == current_user.id)
        .order_by(WishlistItem.created_at.desc())
        .all()
    )


@router.post("/{trek_id}", response_model=WishlistItemWithTrek, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    trek_id: str,
    current_user: User = Depends(require_role(UserRole.TREKKER)),
    db: Session = Depends(get_db),
) -> WishlistItem:
    trek = db.get(Trek, trek_id)
    if trek is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trek not found")

    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.trek_id == trek_id)
        .first()
    )
    if existing:
        return existing

    item = WishlistItem(user_id=current_user.id, trek_id=trek_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{trek_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    trek_id: str,
    current_user: User = Depends(require_role(UserRole.TREKKER)),
    db: Session = Depends(get_db),
) -> None:
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.trek_id == trek_id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist item not found")

    db.delete(item)
    db.commit()
