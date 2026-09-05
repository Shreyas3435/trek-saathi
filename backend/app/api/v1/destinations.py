from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Destination
from app.schemas.trek import DestinationOut

router = APIRouter()


@router.get("", response_model=list[DestinationOut])
def list_destinations(popular_only: bool = False, db: Session = Depends(get_db)) -> list[Destination]:
    query = db.query(Destination)
    if popular_only:
        query = query.filter(Destination.is_popular.is_(True))
    return query.order_by(Destination.name.asc()).all()


@router.get("/{slug}", response_model=DestinationOut)
def get_destination(slug: str, db: Session = Depends(get_db)) -> Destination:
    destination = db.query(Destination).filter(Destination.slug == slug).first()
    if destination is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination not found")
    return destination
