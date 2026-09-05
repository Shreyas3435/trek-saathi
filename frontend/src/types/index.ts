export type UserRole = "trekker" | "organizer" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type DifficultyLevel = "easy" | "moderate" | "difficult" | "challenging";
export type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: UserRole;
  profile_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface OrganizerProfile {
  id: string;
  user_id: string;
  organization_name: string;
  logo_url: string | null;
  cover_image_url: string | null;
  about: string | null;
  website_url: string | null;
  instagram_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  verification_status: VerificationStatus;
  created_at: string;
}

export interface UserWithRelations extends User {
  organizer_profile: OrganizerProfile | null;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  state: string;
  description: string | null;
  cover_image_url: string | null;
  is_popular: boolean;
}

export interface Trek {
  id: string;
  organizer_id: string;
  destination_id: string;
  title: string;
  slug: string;
  trek_date: string;
  duration_days: number;
  difficulty: DifficultyLevel;
  price: number;
  total_seats: number;
  available_seats: number;
  pickup_locations: string | null;
  itinerary: string | null;
  inclusions: string | null;
  exclusions: string | null;
  things_to_carry: string | null;
  cover_image_url: string | null;
  gallery_image_urls: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrekWithRelations extends Trek {
  organizer: OrganizerProfile;
  destination: Destination;
}

export interface TrekFormValues {
  title: string;
  destination_id: string;
  slug: string;
  trek_date: string;
  duration_days: number;
  difficulty: DifficultyLevel;
  price: number;
  total_seats: number;
  pickup_locations: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  things_to_carry: string;
  cover_image_url: string;
  gallery_image_urls: string;
  is_featured: boolean;
  is_active: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  trek_id: string;
  num_participants: number;
  pickup_location: string | null;
  special_requests: string | null;
  contact_phone: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface BookingWithTrek extends Booking {
  trek: Trek;
}

export interface BookingWithUser extends Booking {
  user: User;
}

export interface Review {
  id: string;
  user_id: string;
  trek_id: string;
  rating: number;
  comment: string | null;
  organizer_response: string | null;
  is_flagged: boolean;
  created_at: string;
}

export interface ReviewWithUser extends Review {
  user: User;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  trek_id: string;
  created_at: string;
}

export interface WishlistItemWithTrek extends WishlistItem {
  trek: Trek;
}

export interface PlatformStats {
  total_users: number;
  total_organizers: number;
  total_treks: number;
  total_bookings: number;
}

export interface OrganizerStats {
  total_treks: number;
  pending_booking_requests: number;
  average_rating: number | null;
}
