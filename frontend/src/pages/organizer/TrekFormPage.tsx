import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDestinations } from "@/queries/destinations";
import { useCreateTrek, useMyTreks, useUpdateTrek } from "@/queries/organizerTreks";
import type { DifficultyLevel, TrekFormValues } from "@/types";

const DIFFICULTIES: DifficultyLevel[] = ["easy", "moderate", "difficult", "challenging"];

const EMPTY_FORM: TrekFormValues = {
  title: "",
  destination_id: "",
  slug: "",
  trek_date: "",
  duration_days: 1,
  difficulty: "easy",
  price: 0,
  total_seats: 10,
  pickup_locations: "",
  itinerary: "",
  inclusions: "",
  exclusions: "",
  things_to_carry: "",
  cover_image_url: "",
  gallery_image_urls: "",
  is_featured: false,
  is_active: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function TrekFormPage() {
  const { trekId } = useParams<{ trekId: string }>();
  const isEditMode = !!trekId;
  const navigate = useNavigate();

  const { data: destinations } = useDestinations();
  const { data: myTreks } = useMyTreks();
  const createTrek = useCreateTrek();
  const updateTrek = useUpdateTrek();

  const existingTrek = useMemo(() => myTreks?.find((t) => t.id === trekId), [myTreks, trekId]);

  const [form, setForm] = useState<TrekFormValues>(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingTrek) {
      setForm({
        title: existingTrek.title,
        destination_id: existingTrek.destination_id,
        slug: existingTrek.slug,
        trek_date: existingTrek.trek_date.slice(0, 10),
        duration_days: existingTrek.duration_days,
        difficulty: existingTrek.difficulty,
        price: existingTrek.price,
        total_seats: existingTrek.total_seats,
        pickup_locations: existingTrek.pickup_locations ?? "",
        itinerary: existingTrek.itinerary ?? "",
        inclusions: existingTrek.inclusions ?? "",
        exclusions: existingTrek.exclusions ?? "",
        things_to_carry: existingTrek.things_to_carry ?? "",
        cover_image_url: existingTrek.cover_image_url ?? "",
        gallery_image_urls: existingTrek.gallery_image_urls ?? "",
        is_featured: existingTrek.is_featured,
        is_active: existingTrek.is_active,
      });
      setSlugEdited(true);
    }
  }, [existingTrek]);

  const updateField = <K extends keyof TrekFormValues>(field: K, value: TrekFormValues[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => {
    updateField("title", value);
    if (!slugEdited) {
      updateField("slug", slugify(value));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isEditMode && trekId) {
        await updateTrek.mutateAsync({ trekId, payload: form });
      } else {
        await createTrek.mutateAsync(form);
      }
      navigate("/organizer/treks");
    } catch {
      setError("Could not save this trek. Check that the slug is unique and all required fields are filled.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-pine">{isEditMode ? "Edit trek" : "New trek"}</h1>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-pine">
            Title
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
              required
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Slug
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                updateField("slug", e.target.value);
              }}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
              required
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Destination
            <select
              value={form.destination_id}
              onChange={(e) => updateField("destination_id", e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
              required
            >
              <option value="" disabled>
                Select a destination
              </option>
              {destinations?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-pine">
              Trek date
              <input
                type="date"
                value={form.trek_date}
                onChange={(e) => updateField("trek_date", e.target.value)}
                className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
                required
              />
            </label>
            <label className="block text-sm font-medium text-pine">
              Duration (days)
              <input
                type="number"
                min={1}
                value={form.duration_days}
                onChange={(e) => updateField("duration_days", Number(e.target.value))}
                className="num mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-pine">
              Difficulty
              <select
                value={form.difficulty}
                onChange={(e) => updateField("difficulty", e.target.value as DifficultyLevel)}
                className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-blaze/50"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="capitalize">
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-pine">
              Price (INR)
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => updateField("price", Number(e.target.value))}
                className="num mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
                required
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-pine">
            Total seats
            <input
              type="number"
              min={1}
              value={form.total_seats}
              onChange={(e) => updateField("total_seats", Number(e.target.value))}
              className="num mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
              required
            />
          </label>

          <label className="block text-sm font-medium text-pine">
            Cover image URL
            <input
              value={form.cover_image_url}
              onChange={(e) => updateField("cover_image_url", e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Pickup locations
            <input
              value={form.pickup_locations}
              onChange={(e) => updateField("pickup_locations", e.target.value)}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Itinerary
            <textarea
              value={form.itinerary}
              onChange={(e) => updateField("itinerary", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Inclusions
            <textarea
              value={form.inclusions}
              onChange={(e) => updateField("inclusions", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Exclusions
            <textarea
              value={form.exclusions}
              onChange={(e) => updateField("exclusions", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>
          <label className="block text-sm font-medium text-pine">
            Things to carry
            <textarea
              value={form.things_to_carry}
              onChange={(e) => updateField("things_to_carry", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-moss/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blaze/50"
            />
          </label>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-pine">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => updateField("is_featured", e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-pine">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
              />
              Active (visible to trekkers)
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={createTrek.isPending || updateTrek.isPending}>
            {isEditMode ? "Save changes" : "Create trek"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default TrekFormPage;
