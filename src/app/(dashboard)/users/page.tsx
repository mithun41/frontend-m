"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, User as UserIcon } from "lucide-react";
import { userService, User } from "@/lib/api/userService";
import { DataTable } from "@/components/ui/DataTable";
import Image from "next/image";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search, roleFilter],
    queryFn: () => userService.getUsers(page, search, roleFilter),
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">View and manage all registered users.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xs border border-gray-200/80 dark:border-gray-800 p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center mb-4 sm:mb-6">
          <div className="relative w-full sm:w-80 md:w-96">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-44 px-3.5 py-2 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full">
          {isLoading ? (
            <div className="py-20 text-center text-gray-500 text-sm">Loading users...</div>
          ) : (
            <DataTable 
              columns={[
                { 
                  key: "user", 
                  header: "User", 
                  render: (user: User) => (
                    <div className="flex items-center gap-3 min-w-[150px]">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                        {user.profile_pic ? (
                          <Image src={user.profile_pic} alt={user.name} fill className="object-cover" unoptimized />
                        ) : (
                          <UserIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white block truncate max-w-[160px]">{user.name}</span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 block truncate max-w-[160px]">{user.email}</span>
                      </div>
                    </div>
                  )
                },
                { 
                  key: "contact", 
                  header: "Contact Details", 
                  render: (user: User) => (
                    <div className="min-w-[140px]">
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 block font-medium">{user.phone_number || 'N/A'}</span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 block truncate max-w-[200px]">{user.address || 'No address'}</span>
                    </div>
                  ) 
                },
                { 
                  key: "role", 
                  header: "Role", 
                  render: (user: User) => (
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap
                      ${user.role === 'admin' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                    >
                      {user.role}
                    </span>
                  ) 
                }
              ]}
              data={data?.results || []}
              paginated={true}
              serverPagination={true}
              totalItems={data?.count || 0}
              currentPage={page}
              itemsPerPage={20}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
