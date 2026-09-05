import { useState } from "react";

import { cn, formatDate } from "@/lib/utils";
import { useAdminUsers } from "@/queries/admin";
import type { UserRole } from "@/types";

const FILTERS: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "trekker", label: "Trekkers" },
  { value: "organizer", label: "Organizers" },
  { value: "admin", label: "Admins" },
];

export function AdminUsersPage() {
  const [filter, setFilter] = useState<UserRole | "all">("all");
  const { data: users, isLoading } = useAdminUsers(filter === "all" ? undefined : filter);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">Users</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-blaze bg-blaze text-white"
                : "border-moss/30 text-pine/70 hover:border-moss/60",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-moss/15 bg-white/70">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-moss/15 text-moss">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-moss">
                  Loading users...
                </td>
              </tr>
            )}
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-moss/10 last:border-0">
                <td className="px-4 py-3 text-pine">{u.full_name}</td>
                <td className="px-4 py-3 text-pine/80">{u.email}</td>
                <td className="px-4 py-3 capitalize text-pine/80">{u.role}</td>
                <td className="num px-4 py-3 text-pine/80">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsersPage;
