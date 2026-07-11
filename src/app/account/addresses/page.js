import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { MapPin, Plus, Home, Briefcase, Trash2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Saved Addresses — Hardvanta" };

export default async function AddressesPage() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/addresses");

  const { prisma } = await import("@/lib/prisma");
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="min-h-screen bg-cloud">
      {/* Header */}
      <div className="bg-navy">
        <div className="container-page py-6">
          <div className="flex items-center gap-3">
            <Link href="/account" className="text-silver hover:text-white text-sm">
              ← My Account
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white">Saved Addresses</h1>
          <p className="text-sm text-silver/70">Manage your delivery addresses</p>
        </div>
      </div>

      <div className="container-page py-6">
        {addresses.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-silver-light bg-white py-16 text-center shadow-card">
            <MapPin size={48} className="mb-4 text-silver" />
            <h2 className="text-lg font-bold text-navy">No saved addresses</h2>
            <p className="mt-1 text-sm text-silver-dark">
              Add a delivery address to make checkout faster
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`relative rounded-2xl border bg-white p-5 shadow-card ${
                  addr.isDefault ? "border-royal ring-1 ring-royal" : "border-silver-light"
                }`}
              >
                {addr.isDefault && (
                  <span className="absolute right-4 top-4 rounded-full bg-royal px-2 py-0.5 text-[11px] font-bold text-white">
                    Default
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cloud">
                    <Home size={18} className="text-royal" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{addr.fullName}</p>
                    <p className="text-sm text-silver-dark">{addr.phone}</p>
                    <p className="mt-1 text-sm text-silver-dark">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                    </p>
                    <p className="text-sm text-silver-dark">
                      {addr.city}, {addr.state} — {addr.postalCode}
                    </p>
                    <p className="text-sm text-silver-dark">{addr.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info note */}
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
          💡 Addresses are automatically saved when you place an order during checkout.
        </div>
      </div>
    </div>
  );
}