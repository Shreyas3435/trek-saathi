import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile } from "@/queries/user";

export function ProfileSettingsPage() {
  const { user, refetchUser } = useAuth();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number ?? "");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaved(false);
    await updateProfile.mutateAsync({ full_name: fullName, phone_number: phoneNumber });
    await refetchUser();
    setSaved(true);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">Profile settings</h1>

      <Card className="mt-6 max-w-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-pine">
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Phone number
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Email
            <input
              value={user?.email ?? ""}
              disabled
              className="mt-1 w-full rounded-lg border border-moss/20 bg-moss/5 px-3 py-2 text-sm text-moss"
            />
          </label>
          {saved && <p className="text-sm text-moss">Profile updated.</p>}
          <Button type="submit" disabled={updateProfile.isPending}>
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ProfileSettingsPage;
