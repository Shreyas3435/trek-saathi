import { Menu, Mountain, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const NAV_LINKS = [
  { to: "/search", label: "Treks" },
  { to: "/destinations", label: "Destinations" },
  { to: "/organizers", label: "Organizers" },
];

const DASHBOARD_PATH: Record<UserRole, string> = {
  trekker: "/dashboard",
  organizer: "/organizer/dashboard",
  admin: "/admin",
};

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-moss/10 bg-mist/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-canopy">
          <Mountain className="h-5 w-5 text-blaze" />
          Trek Platform
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn("text-sm font-medium text-pine/80 hover:text-pine", isActive && "text-pine")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to={DASHBOARD_PATH[user.role]}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button type="button" className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X className="h-6 w-6 text-pine" /> : <Menu className="h-6 w-6 text-pine" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-moss/10 bg-mist px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-pine/80 hover:text-pine"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to={DASHBOARD_PATH[user.role]} onClick={() => setMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
