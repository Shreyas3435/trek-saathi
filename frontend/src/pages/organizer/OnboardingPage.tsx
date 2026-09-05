import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useCreateOrganizerProfile } from "@/queries/organizerProfile";

export function OnboardingPage() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const createProfile = useCreateOrganizerProfile();

  const [organizationName, setOrganizationName] = useState("");
  const [about, setAbout] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createProfile.mutateAsync({
        organization_name: organizationName,
        about: about || undefined,
        website_url: websiteUrl || undefined,
        instagram_url: instagramUrl || undefined,
        contact_email: contactEmail || undefined,
        contact_phone: contactPhone || undefined,
      });
      await refetchUser();
      navigate("/organizer/dashboard");
    } catch {
      setError("Could not create your organizer profile. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-pine">Set up your organizer profile</h1>
      <p className="mt-1 text-sm text-moss">
        Tell trekkers who you are before you list your first trek. You can edit this anytime.
      </p>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-pine">
            Organization name
            <input
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
              required
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            About
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Website
            <input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Instagram
            <input
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Contact email
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Contact phone
            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={createProfile.isPending}>
            Complete setup
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default OnboardingPage;
