import { Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Banners — Admin" };

export default async function BannersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Banners</h1>
        <p className="text-sm text-silver-dark mt-0.5">Manage homepage banners</p>
      </div>

      <div className="rounded-xl border border-silver-light bg-white shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-silver-light bg-cloud">
          <p className="text-xs font-bold uppercase tracking-wider text-royal">Current Banners</p>
        </div>

        {/* Banner list */}
        <div className="divide-y divide-silver-light">
          {[
            { title: "Hero Banner", location: "Homepage Hero", status: "Active" },
            { title: "Deals Banner", location: "Homepage Deals Section", status: "Active" },
            { title: "Promo Banner", location: "Homepage Bottom", status: "Active" },
          ].map((banner) => (
            <div key={banner.title} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-cloud border border-silver-light">
                  <ImageIcon size={20} className="text-silver" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{banner.title}</p>
                  <p className="text-xs text-silver-dark">{banner.location}</p>
                </div>
              </div>
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                {banner.status}
              </span>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 bg-cloud border-t border-silver-light">
          <p className="text-xs text-silver-dark">
            💡 To update banners, edit the Hero and section components in <code className="bg-silver-light px-1 rounded">src/components/home/</code>
          </p>
        </div>
      </div>
    </div>
  );
}