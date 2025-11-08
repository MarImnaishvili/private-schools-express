import ReadOnlySchoolDataGrid from "@/components/ReadOnlySchoolDataGrid";
import { Toaster } from "sonner";

export default function SchoolsTablePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <Toaster position="top-right" />
      <ReadOnlySchoolDataGrid />
    </div>
  );
}
