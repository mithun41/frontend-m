import DashboardNavbar from "@/app/(dashboard)/components/DashboardNavbar";
import Sidebar from "@/components/layouts/Sidebar";
import { Footer } from "@/components/layouts/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mocked authentication check
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        {children}
      </div>
    );
  }

  return (
    <div className="relative flex w-full h-screen overflow-hidden bg-background">
      <Sidebar />

      <main className="flex flex-col flex-grow h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="shrink-0">
          <DashboardNavbar />
        </div>

        <div className="flex-grow p-4 md:p-6">
          {/* Add your PageLoader here if needed in the future */}
          {children}
        </div>

      
      </main>
    </div>
  );
}
