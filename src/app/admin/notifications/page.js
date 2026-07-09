import { Bell } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications — Admin" };

export default async function NotificationsPage() {
  const { prisma } = await import("@/lib/prisma");

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Notifications</h1>
        <p className="text-sm text-silver-dark mt-0.5">{notifications.length} total notifications</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-silver-light bg-white shadow-card">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell size={40} className="mb-3 text-silver" />
            <p className="font-semibold text-navy">No notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-silver-light">
            {notifications.map((notif) => (
              <li key={notif.id} className={`flex items-start gap-4 px-5 py-4 ${!notif.isRead ? "bg-royal/5" : ""}`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cloud">
                  <Bell size={16} className="text-royal" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy">{notif.title}</p>
                  <p className="text-sm text-silver-dark">{notif.message}</p>
                  <p className="mt-1 text-xs text-silver-dark">
                    {notif.user?.name || "System"} · {new Date(notif.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                {!notif.isRead && <span className="h-2 w-2 rounded-full bg-royal mt-2" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}