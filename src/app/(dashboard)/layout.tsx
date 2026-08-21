import type { Metadata } from "next";
import DashboardNavbar from "@/app/(dashboard)/components/DashboardNavbar";
import Sidebar from "@/components/layout/Sidebar"; 
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  title: "Admin Dashboard | DRAVON FIT",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="relative flex w-full h-screen overflow-hidden bg-background">
        <Sidebar />

        <main className="flex flex-col flex-grow h-screen overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 w-full min-w-0">
          <div className="shrink-0">
            <DashboardNavbar />
          </div>

          <div className="flex-grow p-3 sm:p-4 md:p-6 w-full min-w-0 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
