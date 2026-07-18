import { FileSpreadsheet, FileText, FileDown } from "lucide-react";

/** Download links for the enquiry export API (`/api/admin/enquiries/export`). */
export default function ExportButtons({ type = "all" }) {
  const formats = [
    { format: "csv", label: "CSV", Icon: FileDown },
    { format: "xlsx", label: "Excel", Icon: FileSpreadsheet },
    { format: "pdf", label: "PDF", Icon: FileText },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {formats.map(({ format, label, Icon }) => (
        <a
          key={format}
          href={`/api/admin/enquiries/export?type=${type}&format=${format}`}
          className="inline-flex items-center gap-1.5 rounded-lg glass-card px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white hover:shadow-glow-electric transition-all"
        >
          <Icon size={14} /> Export {label}
        </a>
      ))}
    </div>
  );
}
