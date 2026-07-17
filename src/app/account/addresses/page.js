import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { MapPin, Home } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-20%] h-96 w-96 bg-electric/10" />

      {/* Header */}
      <div className="relative border-b border-white/10">
        <div className="container-page py-6">
          <div className="flex items-center gap-3">
            <Link href="/account" className="text-white/50 hover:text-electric-light text-sm">
              ← My Account
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white">Saved Addresses</h1>
          <p className="text-sm text-white/50">Manage your delivery addresses</p>
        </div>
      </div>

      <div className="container-page relative py-6">
        {addresses.length === 0 ? (
          /* Empty state */
          <div className="glass-card flex flex-col items-center justify-center rounded-3xl py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-electric/20 to-liquid/20 shadow-glow-electric">
              <MapPin size={30} className="text-electric-light" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-white">No saved addresses</h2>
            <p className="mt-1 text-sm text-white/50">
              Add a delivery address to make checkout faster
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`glass-card relative rounded-2xl p-5 transition-all hover:shadow-glow-electric ${
                  addr.isDefault ? "ring-1 ring-electric/50" : ""
                }`}
              >
                {addr.isDefault && (
                  <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-electric to-liquid px-2 py-0.5 text-[11px] font-bold text-white">
                    Default
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
                    <Home size={18} className="text-electric-light" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{addr.fullName}</p>
                    <p className="text-sm text-white/50">{addr.phone}</p>
                    <p className="mt-1 text-sm text-white/50">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                    </p>
                    <p className="text-sm text-white/50">
                      {addr.city}, {addr.state} — {addr.postalCode}
                    </p>
                    <p className="text-sm text-white/50">{addr.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info note */}
        <div className="mt-6 rounded-xl bg-electric/10 border border-electric/20 p-4 text-sm text-electric-light">
          💡 Addresses are automatically saved when you place an order during checkout.
        </div>
      </div>
    </div>
  );
}
