import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import AdminViewReset from "@/components/admin/AdminViewReset";
import AdminSidebarNav from "@/components/admin/AdminSidebarNav";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — hardvanta" };

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/login?callbackUrl=/admin");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />
      <div className="container-page relative flex flex-col gap-6 py-8 lg:flex-row">
        <AdminViewReset />
        <AdminSidebarNav />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
