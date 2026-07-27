import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import Link from "next/link";
import AddressBookManager from "@/components/account/AddressBookManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Saved Addresses — HV KART" };

export default async function AddressesPage() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/addresses");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-silver to-brand-bg">
      <div className="liquid-blob left-1/4 top-[-20%] h-96 w-96 bg-brand-blue/10" />

      {/* Header */}
      <div className="relative border-b border-brand-border">
        <div className="container-page py-6">
          <div className="flex items-center gap-3">
            <Link href="/account" className="text-brand-muted hover:text-brand-blue text-sm">
              ← My Account
            </Link>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-brand-text">Saved Addresses</h1>
          <p className="text-sm text-brand-muted">Manage your delivery addresses</p>
        </div>
      </div>

      <div className="container-page relative py-6">
        <AddressBookManager />
      </div>
    </div>
  );
}
