// Shown automatically while a route segment is loading (instead of a blank screen).
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center">
      <Loader2 size={36} className="animate-spin text-brand-blue" />
    </div>
  );
}
