import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings — Admin" };

export default async function SettingsPage() {
  const { prisma } = await import("@/lib/prisma");

  const gst = await prisma.gSTDetails.findFirst();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Settings</h1>
        <p className="text-sm text-silver-dark mt-0.5">Store configuration</p>
      </div>

      <div className="space-y-4">
        {/* GST Details */}
        <div className="rounded-xl border border-silver-light bg-white p-6 shadow-card">
          <h2 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
            <Settings size={18} className="text-royal" /> GST Details
          </h2>
          {gst ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-silver-dark uppercase font-semibold">Company</p>
                <p className="font-semibold text-navy mt-0.5">{gst.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-silver-dark uppercase font-semibold">GST Number</p>
                <p className="font-semibold text-navy mt-0.5">{gst.gstNumber}</p>
              </div>
              <div>
                <p className="text-xs text-silver-dark uppercase font-semibold">PAN</p>
                <p className="font-semibold text-navy mt-0.5">{gst.panNumber || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-silver-dark uppercase font-semibold">Email</p>
                <p className="font-semibold text-navy mt-0.5">{gst.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-silver-dark uppercase font-semibold">Phone</p>
                <p className="font-semibold text-navy mt-0.5">{gst.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-silver-dark uppercase font-semibold">Address</p>
                <p className="font-semibold text-navy mt-0.5">{gst.address}, {gst.city}, {gst.state} - {gst.pincode}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-silver-dark">No GST details configured yet.</p>
          )}
        </div>

        {/* Store Info */}
        <div className="rounded-xl border border-silver-light bg-white p-6 shadow-card">
          <h2 className="text-base font-bold text-navy mb-4">Store Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-silver-dark uppercase font-semibold">Store Name</p>
              <p className="font-semibold text-navy mt-0.5">Hardvanta</p>
            </div>
            <div>
              <p className="text-xs text-silver-dark uppercase font-semibold">Support Phone</p>
              <p className="font-semibold text-navy mt-0.5">+91 91705 46395</p>
            </div>
            <div>
              <p className="text-xs text-silver-dark uppercase font-semibold">Free Shipping Above</p>
              <p className="font-semibold text-navy mt-0.5">₹999</p>
            </div>
            <div>
              <p className="text-xs text-silver-dark uppercase font-semibold">Shipping Charge</p>
              <p className="font-semibold text-navy mt-0.5">₹49</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}