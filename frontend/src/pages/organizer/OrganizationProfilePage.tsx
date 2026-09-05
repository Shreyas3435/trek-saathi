import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useUpdateOrganizerProfile } from "@/queries/organizerProfile";

export function OrganizationProfilePage() {
  const { user, refetchUser } = useAuth();
  const profile = user?.organizer_profile;
  const updateProfile = useUpdateOrganizerProfile();

  const [organizationName, setOrganizationName] = useState(profile?.organization_name ?? "");
  const [about, setAbout] = useState(profile?.about ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url ?? "");
  const [instagramUrl, setInstagramUrl] = useState(profile?.instagram_url ?? "");
  const [contactEmail, setContactEmail] = useState(profile?.contact_email ?? "");
  const [contactPhone, setContactPhone] = useState(profile?.contact_phone ?? "");
  const [logoUrl, setLogoUrl] = useState(profile?.logo_url ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(profile?.cover_image_url ?? "");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaved(false);
    await updateProfile.mutateAsync({
      organization_name: organizationName,
      about,
      website_url: websiteUrl,
      instagram_url: instagramUrl,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      logo_url: logoUrl,
      cover_image_url: coverImageUrl,
    });
    await refetchUser();
    setSaved(true);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-pine">Organization profile</h1>

      <Card className="mt-6 max-w-xl p-6">
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
            Logo URL
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Cover image URL
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
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
          {saved && <p className="text-sm text-moss">Profile updated.</p>}
          <Button type="submit" disabled={updateProfile.isPending}>
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default OrganizationProfilePage;
