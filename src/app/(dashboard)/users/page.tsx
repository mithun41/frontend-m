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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all registered users.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full">
          {isLoading ? (
            <div className="py-20 text-center text-gray-500">Loading users...</div>
          ) : (
            <DataTable 
              columns={[
                { 
                  key: "user", 
                  header: "User", 
                  render: (user: User) => (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200 flex items-center justify-center shrink-0">
                        {user.profile_pic ? (
                          <Image src={user.profile_pic} alt={user.name} fill className="object-cover" unoptimized />
                        ) : (
                          <UserIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 block">{user.name}</span>
                        <span className="text-xs text-gray-500 block">{user.email}</span>
                      </div>
                    </div>
                  )
                },
                { 
                  key: "contact", 
                  header: "Contact Details", 
                  render: (user: User) => (
                    <>
                      <span className="text-sm text-gray-700 block">{user.phone_number || 'N/A'}</span>
                      <span className="text-xs text-gray-500 block truncate max-w-[200px]">{user.address || 'No address'}</span>
                    </>
                  ) 
                },
                { 
                  key: "role", 
                  header: "Role", 
                  render: (user: User) => (
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md
                      ${user.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
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
