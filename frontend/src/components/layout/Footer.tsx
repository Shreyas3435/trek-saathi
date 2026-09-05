import { Link } from "react-router-dom";

import { TrailLine } from "@/components/TrailLine";

export function Footer() {
  return (
    <footer className="border-t border-moss/10 bg-canopy text-mist">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <TrailLine
          className="mb-8 h-8 w-full text-blaze/60"
          points="0,30 60,10 120,22 180,4 240,18 300,8 360,25 420,12 480,20 540,6 600,16"
        />
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-lg font-semibold">Trek Platform</p>
            <p className="mt-2 text-sm text-mist/60">
              The largest trekking discovery platform in India, starting with the Western Ghats.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-mist/80">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-mist/60">
              <li>
                <Link to="/search" className="hover:text-mist">
                  Treks
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-mist">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/organizers" className="hover:text-mist">
                  Organizers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-mist/80">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-mist/60">
              <li>
                <Link to="/about" className="hover:text-mist">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-mist">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-mist/80">For organizers</p>
            <ul className="mt-3 space-y-2 text-sm text-mist/60">
              <li>
                <Link to="/register" className="hover:text-mist">
                  List your treks
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-xs text-mist/40">
          &copy; {new Date().getFullYear()} Trek Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
