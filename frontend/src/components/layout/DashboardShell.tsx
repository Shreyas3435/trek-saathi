import type { LucideIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

interface DashboardShellProps {
  navItems: DashboardNavItem[];
  title: string;
}

export function DashboardShell({ navItems, title }: DashboardShellProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row">
      <aside className="lg:w-64 lg:shrink-0">
        <p className="mb-4 px-2 font-display text-sm font-semibold uppercase tracking-wide text-moss">{title}</p>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-pine/70 transition-colors hover:bg-canopy/5",
                    isActive && "bg-canopy text-mist hover:bg-canopy",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
