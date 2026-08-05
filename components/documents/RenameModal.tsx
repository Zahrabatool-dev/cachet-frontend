"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

type RenameModalProps = {
  documentId: string;
  currentTitle: string;
  open: boolean;
  onClose: () => void;
  onRenamed: (newTitle: string) => void;
};

export function RenameModal({ documentId, currentTitle, open, onClose, onRenamed }: RenameModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) setTitle(currentTitle);
  }, [open, currentTitle]);

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed || trimmed === currentTitle) {
      onClose();
      return;
    }
    setIsSaving(true);
    try {
      await api.put(`/documents/${documentId}`, { title: trimmed });
      toast.success("Document renamed");
      onRenamed(trimmed);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Couldn't rename document");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm vault-panel p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-medium text-[rgb(var(--color-text))] flex items-center gap-2">
                <Pencil size={16} className="text-[rgb(var(--color-accent))]" /> Rename document
              </h2>
              <button type="button" onClick={onClose} className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]">
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-[rgb(var(--color-bg))] text-sm outline-none focus:border-[rgb(var(--color-accent))]/50 transition-colors"
            />

            <div className="flex gap-3 mt-5">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/20 text-sm font-medium text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-accent))]/5 transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !title.trim()}
                className="btn-shimmer flex-1 py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 transition-all"
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}