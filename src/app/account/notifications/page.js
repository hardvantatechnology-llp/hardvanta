import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { Bell, Package, Tag, Megaphone, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications — Hardvanta" };

export default async function NotificationsPage() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/notifications");

  const { prisma } = await import("@/lib/prisma");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-royal px-2.5 py-0.5 text-xs font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-silver/70">Your order updates and alerts</p>
        </div>
      </div>

      <div className="container-page py-6 max-w-2xl">
        {notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-silver-light bg-white py-16 text-center shadow-card">
            <Bell size={48} className="mb-4 text-silver" />
            <h2 className="text-lg font-bold text-navy">No notifications yet</h2>
            <p className="mt-1 text-sm text-silver-dark">
              Order updates and alerts will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-silver-light bg-white shadow-card">
            <ul className="divide-y divide-silver-light">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                    !notif.isRead ? "bg-royal/5" : ""
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cloud">
                    <Bell size={18} className="text-royal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy">{notif.title}</p>
                    <p className="mt-0.5 text-sm text-silver-dark">{notif.message}</p>
                    <p className="mt-1 text-xs text-silver-dark">
                      {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-royal" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}