from fastapi import APIRouter

from app.api.v1 import admin, auth, bookings, destinations, organizers, reviews, treks, wishlist

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(treks.router, prefix="/treks", tags=["treks"])
api_router.include_router(organizers.router, prefix="/organizers", tags=["organizers"])
api_router.include_router(destinations.router, prefix="/destinations", tags=["destinations"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
