"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShareModal } from "@/components/documents/ShareModal";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Tag,
  Calendar,
  HardDrive,
  FileText,
  Loader2,
} from "lucide-react";
import { ActivityTimeline } from "@/components/documents/ActivityTimeline";
import { getFileIcon, formatFileSize } from "@/lib/utils/fileHelpers";
import api from "@/lib/api";

type DocumentDetail = {
  _id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  tags: string[];
  expiryDate: string | null;
  createdAt: string;
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const [docRes, logsRes] = await Promise.all([
          api.get(`/documents/${id}`),
          api.get(`/documents/dashboard/activity-logs`),
        ]);
        setDoc(docRes.data.document);
        // sirf isi document ke logs filter karo
        const filteredLogs = (logsRes.data.logs || []).filter(
          (log: any) => log.documentId?._id === id || log.documentId === id
        );
        setLogs(filteredLogs);
      } catch (err) {
        toast.error("Couldn't load document");
        router.push("/documents");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoc();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Delete this document permanently? This can't be undone.")) return;
    setIsDeleting(true);
    try {
      await api.delete(`/documents/${id}`);
      toast.success("Document deleted");
      router.push("/documents");
    } catch (err) {
      toast.error("Couldn't delete document");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[rgb(var(--color-accent))]" />
      </div>
    );
  }

  if (!doc) return null;

  const Icon = getFileIcon(doc.title);
  const isImage = doc.fileType.startsWith("image/");
  const isPdf = doc.fileType === "application/pdf";

  return (
    <div className="max-w-5xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/documents")}
        className="flex items-center gap-1.5 text-sm text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent))] transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to Documents
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview pane */}
      <motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className={`lg:col-span-2 vault-panel p-4 overflow-hidden self-start ${
    isPdf ? "" : "flex items-center justify-center min-h-[400px]"
  }`}
  
>
  {isImage ? (
    <img
      src={doc.fileUrl}
      alt={doc.title}
      className="max-w-full max-h-[600px] rounded-lg object-contain"
    />
  ) : isPdf ? (
   <iframe
  src={doc.fileUrl}
  className="w-full h-[700px] rounded-lg border-0 block"
  title={doc.title}
/>
  ) : (
    <div className="text-center py-16">
      <Icon size={48} className="mx-auto text-[rgb(var(--color-accent))]/30" strokeWidth={1} />
      <p className="mt-4 text-sm text-[rgb(var(--color-text-muted))]">
        Preview not available for this file type
      </p>
    </div>
  )}
</motion.div>

        {/* Metadata sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <div className="vault-panel p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-[rgb(var(--color-accent))]/10">
                <Icon size={18} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-base font-medium text-[rgb(var(--color-text))] break-words">
                  {doc.title}
                </h1>
                <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5">
                  {doc.category}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-[rgb(var(--color-text-muted))]">
                <HardDrive size={14} />
                <span>{formatFileSize(doc.fileSize)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[rgb(var(--color-text-muted))]">
                <Calendar size={14} />
                <span>Uploaded {new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
              {doc.expiryDate && (
                <div className="flex items-center gap-2.5 text-amber-600">
                  <Calendar size={14} />
                  <span>Expires {new Date(doc.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
              {doc.tags.length > 0 && (
                <div className="flex items-start gap-2.5 text-[rgb(var(--color-text-muted))]">
                  <Tag size={14} className="mt-0.5 shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-[rgb(var(--color-accent))]/8 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-5 border-t border-[rgb(var(--color-accent))]/10 flex gap-2">
              <a
                href={doc.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium hover:brightness-110 transition-all"
              >
                <Download size={14} /> Download
              </a>
              <button
                onClick={() => setShareModalOpen(true)}
                className="flex items-center justify-center w-10 rounded-lg border border-[rgb(var(--color-accent))]/20 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 transition-colors"
              >
                <Share2 size={15} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center w-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          </div>

          {/* Activity history */}
          <div className="vault-panel p-5">
            <h2 className="text-sm font-medium text-[rgb(var(--color-text))] mb-4">
              Activity history
            </h2>
            <ActivityTimeline logs={logs} />
          </div>
        </motion.div>
      </div>

      {doc && (
        <ShareModal
          documentId={doc._id}
          documentTitle={doc.title}
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </div>
  );
}