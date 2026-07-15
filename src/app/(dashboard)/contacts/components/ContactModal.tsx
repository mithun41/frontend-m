import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { ContactData, contactService } from "@/lib/api/contactService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactData | null;
  mode: 'view' | 'edit';
}

export default function ContactModal({ isOpen, onClose, contact, mode }: ContactModalProps) {
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState<'pending' | 'replied' | 'closed'>("pending");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && contact) {
      setReply(contact.reply || "");
      setStatus(contact.status || "pending");
    }
  }, [isOpen, contact]);

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; reply: string; status: 'pending' | 'replied' | 'closed' }) =>
      contactService.updateContact(data.id, { reply: data.reply, status: data.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      Swal.fire({
        toast: true,
        position: 'center',
        icon: 'success',
        title: 'Contact updated successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
      onClose();
    },
    onError: () => {
      Swal.fire({
        toast: true,
        position: 'center',
        icon: 'error',
        title: 'Failed to update contact.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  if (!isOpen || !contact) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.id) return;
    updateMutation.mutate({ id: contact.id, reply, status });
  };

  const getStatusBadge = (s: string) => {
    if (s === 'replied') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Replied
        </span>
      );
    } else if (s === 'closed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400">
          Closed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          Pending
        </span>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'view' ? 'Contact Details' : 'Edit Contact Status & Reply'}
            </h2>
            {mode === 'view' && getStatusBadge(contact.status || 'pending')}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{contact.first_name} {contact.last_name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{contact.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date Submitted</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {new Date(contact.created_at || "").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</p>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{contact.subject}</h3>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Message</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {contact.message}
            </p>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          {mode === 'view' ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Admin Reply {contact.replied_at && <span className="text-xs text-primary-500 font-normal ml-2">(Sent on {new Date(contact.replied_at).toLocaleString()})</span>}
                </p>
                {contact.reply ? (
                  <div className="bg-green-50/50 dark:bg-green-950/10 p-4 rounded-xl border border-green-100/50 dark:border-green-900/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {contact.reply}
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    No reply has been submitted yet.
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label htmlFor="reply" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Reply {contact.replied_at && <span className="text-xs text-primary-500 font-normal ml-2">(Last updated on {new Date(contact.replied_at).toLocaleString()})</span>}
                </label>
                <textarea
                  id="reply"
                  rows={5}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your response here..."
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900 dark:text-white resize-none text-sm"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary-500/20"
                >
                  <Save className="w-4 h-4" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
