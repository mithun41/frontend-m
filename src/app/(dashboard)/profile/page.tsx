import Link from "next/link";

export default function ProfilePage() {
  const orders = [
    { id: "ORD-98231", date: "June 24, 2026", status: "Delivered", total: "$349.00" },
    { id: "ORD-98110", date: "May 12, 2026", status: "Delivered", total: "$189.00" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 h-fit shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-neutral-500 uppercase tracking-widest text-[10px] mb-3 px-3">
              Account Control
            </span>
            <span className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl font-semibold cursor-pointer">
              Profile Detail
            </span>
            <span className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl font-medium cursor-pointer transition-colors">
              Order History
            </span>
            <span className="px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl font-medium cursor-pointer transition-colors text-rose-500">
              Sign Out
            </span>
          </div>
        </aside>

        {/* Dashboard Area */}
        <main className="lg:col-span-3 flex flex-col gap-8">
          {/* Welcome Panel */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hello, John Doe</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Manage your personal info, shipping addresses, and check recent order logs.
            </p>
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Recent Orders</h2>
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-sm"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {order.id}
                    </span>
                    <span className="text-xs text-neutral-400">{order.date}</span>
                  </div>
                  <div className="flex items-center gap-6 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="font-bold">{order.total}</span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
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
