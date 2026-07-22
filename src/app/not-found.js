import Link from "next/link";
import { PackageX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <PackageX size={48} className="text-brand-blue" />
      <h1 className="mt-4 text-2xl font-bold text-brand-text">Page not found</h1>
      <p className="mt-2 text-sm text-brand-muted">
        The page or product you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-blue px-6 py-3 font-semibold text-white hover:bg-brand-navy"
      >
        Back to Home
      </Link>
    </div>
  );
}
