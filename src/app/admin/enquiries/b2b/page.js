import BulkEnquiryListPage from "@/components/admin/BulkEnquiryListPage";

export const dynamic = "force-dynamic";
export const metadata = { title: "B2B / Bulk Orders — Admin" };

export default function AdminB2BBulkOrdersPage({ searchParams }) {
  return (
    <BulkEnquiryListPage
      searchParams={searchParams}
      title="B2B / Bulk Orders"
      description="Submissions from the Hardvanta B2B page and its Bulk Orders form"
      basePath="/admin/enquiries/b2b"
      enquiryTypeFilter={{ enquiryType: "B2B / Bulk" }}
      exportType="b2b"
    />
  );
}
