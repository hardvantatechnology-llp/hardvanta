import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import Link from "next/link";
import AddressBookManager from "@/components/account/AddressBookManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Saved Addresses — Hardvanta" };

export default async function AddressesPage() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/addresses");

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
        <AddressBookManager />
      </div>
    </div>
  );
}
