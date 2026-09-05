import { Mail } from "lucide-react";

export function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-pine">Contact us</h1>
      <p className="mt-4 text-pine/80">
        Have a question, feedback, or want to list your treks? Reach out and we&apos;ll get back to you.
      </p>
      <a href="mailto:hello@trekplatform.in" className="mt-6 flex items-center gap-2 text-blaze hover:underline">
        <Mail className="h-4 w-4" /> hello@trekplatform.in
      </a>
    </div>
  );
}

export default ContactPage;
