import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { ContactData, contactService } from "@/lib/api/contactService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactData | null;
}

export default function ContactModal({ isOpen, onClose, contact }: ContactModalProps) {
  const [reply, setReply] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && contact) {
      setReply(contact.reply || "");
    }
  }, [isOpen, contact]);

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; reply: string }) =>
      contactService.updateContact(data.id, { reply: data.reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      Swal.fire({
        toast: true,
        position: 'center',
        icon: 'success',
        title: 'Reply sent successfully.',
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
        title: 'Failed to send reply.',
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  if (!isOpen || !contact) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.id) return;
    updateMutation.mutate({ id: contact.id, reply });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Details</h2>
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {new Date(contact.created_at || "").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{contact.subject}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {contact.message}
            </p>
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reply" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Your Reply {contact.replied_at && <span className="text-xs text-primary-500 font-normal ml-2">(Replied on {new Date(contact.replied_at).toLocaleString()})</span>}
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
                <Send className="w-4 h-4" />
                {updateMutation.isPending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
