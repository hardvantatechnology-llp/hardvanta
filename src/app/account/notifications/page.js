import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { Bell } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-silver to-brand-bg">
      <div className="liquid-blob left-1/4 top-[-20%] h-96 w-96 bg-brand-steel/10" />

      {/* Header */}
      <div className="relative border-b border-brand-border">
        <div className="container-page py-6">
          <div className="flex items-center gap-3">
            <Link href="/account" className="text-brand-muted hover:text-brand-blue text-sm">
              ← My Account
            </Link>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-brand-text">Notifications</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-gradient-to-r from-brand-blue to-brand-navy px-2.5 py-0.5 text-xs font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-brand-muted">Your order updates and alerts</p>
        </div>
      </div>

      <div className="container-page relative py-6 max-w-2xl">
        {notifications.length === 0 ? (
          /* Empty state */
          <div className="glass-brand-card flex flex-col items-center justify-center rounded-3xl py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-navy/20 shadow-brand-glow">
              <Bell size={30} className="text-brand-blue" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-brand-text">No notifications yet</h2>
            <p className="mt-1 text-sm text-brand-muted">
              Order updates and alerts will appear here
            </p>
          </div>
        ) : (
          <div className="glass-brand-card overflow-hidden rounded-2xl">
            <ul className="divide-y divide-brand-border">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                    !notif.isRead ? "bg-brand-blue/5" : ""
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-silver">
                    <Bell size={18} className="text-brand-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-text">{notif.title}</p>
                    <p className="mt-0.5 text-sm text-brand-muted">{notif.message}</p>
                    <p className="mt-1 text-xs text-brand-muted">
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
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-brand-blue to-brand-navy" />
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
