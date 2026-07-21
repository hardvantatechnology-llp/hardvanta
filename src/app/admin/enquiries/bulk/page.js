import BulkEnquiryListPage from "@/components/admin/BulkEnquiryListPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bulk Enquiries — Admin" };

export default function AdminBulkEnquiriesPage({ searchParams }) {
  return (
    <BulkEnquiryListPage
      searchParams={searchParams}
      title="Bulk Enquiries"
      description="Submissions from the standalone Bulk Enquiry page"
      basePath="/admin/enquiries/bulk"
      enquiryTypeFilter={{ NOT: { enquiryType: "B2B / Bulk" } }}
      exportType="bulk"
    />
  );
}
