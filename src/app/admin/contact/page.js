import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact Messages — Admin" };

export default async function ContactPage() {
  const { prisma } = await import("@/lib/prisma");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Contact Messages</h1>
        <p className="text-sm text-silver-dark mt-0.5">{messages.length} total messages</p>
      </div>
      
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-silver-light bg-white py-16 text-center shadow-card">
            <Mail size={40} className="mb-3 text-silver" />
            <p className="font-semibold text-navy">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="rounded-xl border border-silver-light bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-navy">{msg.name}</p>
                  <p className="text-sm text-silver-dark">{msg.email} {msg.phone && `· ${msg.phone}`}</p>
                  {msg.subject && <p className="mt-1 text-sm font-medium text-royal">{msg.subject}</p>}
                </div>
                <p className="text-xs text-silver-dark shrink-0">
                  {new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <p className="mt-3 text-sm text-silver-dark leading-relaxed">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}