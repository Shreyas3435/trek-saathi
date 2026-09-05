import {
  Building2,
  Calendar,
  Compass,
  Heart,
  LayoutDashboard,
  ShieldCheck,
  Star,
  UserCog,
  Users,
} from "lucide-react";
import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/DashboardShell";
import Layout from "@/Layout";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { DestinationDetailsPage } from "@/pages/DestinationDetailsPage";
import { DestinationsPage } from "@/pages/DestinationsPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { OrganizerPublicProfilePage } from "@/pages/OrganizerPublicProfilePage";
import { OrganizersDirectoryPage } from "@/pages/OrganizersDirectoryPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { SearchResultsPage } from "@/pages/SearchResultsPage";
import { TrekDetailsPage } from "@/pages/TrekDetailsPage";
import { AdminOrganizerVerificationPage } from "@/pages/admin/AdminOrganizerVerificationPage";
import { AdminOverviewPage } from "@/pages/admin/AdminOverviewPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { BookingRequestsPage } from "@/pages/organizer/BookingRequestsPage";
import { ManageTreksPage } from "@/pages/organizer/ManageTreksPage";
import { OnboardingPage } from "@/pages/organizer/OnboardingPage";
import { OrganizationProfilePage } from "@/pages/organizer/OrganizationProfilePage";
import { OrganizerDashboardPage } from "@/pages/organizer/OrganizerDashboardPage";
import { ReviewsPage } from "@/pages/organizer/ReviewsPage";
import { TrekFormPage } from "@/pages/organizer/TrekFormPage";
import { BookingHistoryPage } from "@/pages/trekker/BookingHistoryPage";
import { ProfileSettingsPage } from "@/pages/trekker/ProfileSettingsPage";
import { TrekkerDashboardPage } from "@/pages/trekker/TrekkerDashboardPage";
import { WishlistPage } from "@/pages/trekker/WishlistPage";

const TREKKER_NAV_ITEMS: DashboardNavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/bookings", label: "Bookings", icon: Calendar },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/profile", label: "Profile", icon: UserCog },
];

const ORGANIZER_NAV_ITEMS: DashboardNavItem[] = [
  { to: "/organizer/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/organizer/treks", label: "Treks", icon: Compass },
  { to: "/organizer/bookings", label: "Booking requests", icon: Calendar },
  { to: "/organizer/reviews", label: "Reviews", icon: Star },
  { to: "/organizer/profile", label: "Organization", icon: Building2 },
];

const ADMIN_NAV_ITEMS: DashboardNavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/organizers", label: "Organizer verification", icon: ShieldCheck },
  { to: "/admin/users", label: "Users", icon: Users },
];

function TrekkerDashboardLayout() {
  return (
    <ProtectedRoute allowedRoles={["trekker"]}>
      <DashboardShell title="My account" navItems={TREKKER_NAV_ITEMS} />
    </ProtectedRoute>
  );
}

function OrganizerDashboardLayout() {
  return (
    <ProtectedRoute allowedRoles={["organizer"]}>
      <DashboardShell title="Organizer" navItems={ORGANIZER_NAV_ITEMS} />
    </ProtectedRoute>
  );
}

function AdminDashboardLayout() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardShell title="Admin" navItems={ADMIN_NAV_ITEMS} />
    </ProtectedRoute>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/treks/:slug" element={<TrekDetailsPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:slug" element={<DestinationDetailsPage />} />
        <Route path="/organizers" element={<OrganizersDirectoryPage />} />
        <Route path="/organizers/:organizerId" element={<OrganizerPublicProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/organizer/onboarding"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        <Route element={<TrekkerDashboardLayout />}>
          <Route path="dashboard" element={<TrekkerDashboardPage />} />
          <Route path="bookings" element={<BookingHistoryPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
        </Route>

        <Route element={<OrganizerDashboardLayout />}>
          <Route path="organizer/dashboard" element={<OrganizerDashboardPage />} />
          <Route path="organizer/treks" element={<ManageTreksPage />} />
          <Route path="organizer/treks/new" element={<TrekFormPage />} />
          <Route path="organizer/treks/:trekId/edit" element={<TrekFormPage />} />
          <Route path="organizer/bookings" element={<BookingRequestsPage />} />
          <Route path="organizer/reviews" element={<ReviewsPage />} />
          <Route path="organizer/profile" element={<OrganizationProfilePage />} />
        </Route>

        <Route element={<AdminDashboardLayout />}>
          <Route path="admin" element={<AdminOverviewPage />} />
          <Route path="admin/organizers" element={<AdminOrganizerVerificationPage />} />
          <Route path="admin/users" element={<AdminUsersPage />} />
        </Route>

        <Route path="*" element={<PlaceholderPage title="Page not found" />} />
      </Route>
    </Routes>
  );
}

export default App;
