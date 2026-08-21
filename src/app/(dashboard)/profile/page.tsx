import Link from "next/link";

export default function ProfilePage() {
  const orders = [
    { id: "ORD-98231", date: "June 24, 2026", status: "Delivered", total: "$349.00" },
    { id: "ORD-98110", date: "May 12, 2026", status: "Delivered", total: "$189.00" },
  ];

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-50 py-4 sm:py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 h-fit shadow-xs">
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-neutral-500 uppercase tracking-widest text-[10px] mb-2 px-3">
              Account Control
            </span>
            <span className="px-3.5 py-2 text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl font-semibold cursor-pointer">
              Profile Detail
            </span>
            <span className="px-3.5 py-2 text-xs sm:text-sm hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl font-medium cursor-pointer transition-colors">
              Order History
            </span>
            <span className="px-3.5 py-2 text-xs sm:text-sm hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl font-medium cursor-pointer transition-colors text-rose-500">
              Sign Out
            </span>
          </div>
        </aside>

        {/* Dashboard Area */}
        <main className="lg:col-span-3 flex flex-col gap-6">
          {/* Welcome Panel */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">Hello, User</h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 sm:mt-2">
              Manage your personal info, shipping addresses, and check recent order logs.
            </p>
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Recent Orders</h2>
            <div className="flex flex-col gap-3 sm:gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs sm:text-sm gap-2 sm:gap-0"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {order.id}
                    </span>
                    <span className="text-[11px] text-neutral-400">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="font-bold">{order.total}</span>
                    <span className="px-2.5 py-0.5 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
