"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, Trash2, Edit } from "lucide-react";
import { contactService, ContactData } from "@/lib/api/contactService";
import Swal from "sweetalert2";
import ContactModal from "./components/ContactModal";
import { DataTable, Column } from "@/components/ui/DataTable";

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => contactService.getContacts(),
  });

  const filteredContacts = (Array.isArray(data) ? data : []).filter((contact) => {
    const searchLower = search.toLowerCase();
    return (
      contact.first_name?.toLowerCase().includes(searchLower) ||
      contact.last_name?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.subject?.toLowerCase().includes(searchLower) ||
      contact.message?.toLowerCase().includes(searchLower)
    );
  });

  const deleteMutation = useMutation({
    mutationFn: contactService.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      Swal.fire({
        toast: true,
        position: 'center',
        icon: 'success',
        title: 'Contact deleted successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      Swal.fire({
        toast: true,
        position: 'center',
        icon: 'error',
        title: 'Failed to delete contact.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleView = (contact: ContactData) => {
    setSelectedContact(contact);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (contact: ContactData) => {
    setSelectedContact(contact);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const columns: Column<ContactData>[] = [
    {
      key: "id",
      header: "ID",
      render: (item) => <span className="text-gray-500 font-medium">#{item.id}</span>
    },
    {
      key: "name",
      header: "Name",
      render: (item) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {item.first_name} {item.last_name}
        </span>
      )
    },
    {
      key: "email",
      header: "Email",
      render: (item) => <span className="text-gray-600 dark:text-gray-400">{item.email}</span>
    },
    {
      key: "subject",
      header: "Subject",
      render: (item) => <span className="text-gray-700 dark:text-gray-300 max-w-[200px] truncate block" title={item.subject}>{item.subject}</span>
    },
    {
      key: "created_at",
      header: "Date",
      render: (item) => (
        <span className="text-gray-500 text-sm whitespace-nowrap">
          {new Date(item.created_at || "").toLocaleDateString()}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const status = item.status || 'pending';
        if (status === 'replied') {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Replied
            </span>
          );
        } else if (status === 'closed') {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400">
              Closed
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Pending
            </span>
          );
        }
      }
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            title="Edit Status & Reply"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => item.id && handleDelete(item.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View and respond to user messages.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredContacts}
            paginated={true}
            serverPagination={false}
            itemsPerPage={10}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
        mode={modalMode}
      />
    </div>
  );
}
