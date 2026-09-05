interface PlaceholderPageProps {
  title?: string;
}

export function PlaceholderPage({ title = "Coming soon" }: PlaceholderPageProps) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-2xl font-semibold text-pine">{title}</h1>
      <p className="mt-2 text-moss">This page is still being built.</p>
    </div>
  );
}

export default PlaceholderPage;
