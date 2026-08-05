"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Plus } from "lucide-react";
import { CATEGORIES, type Category, getFileIcon, formatFileSize } from "@/lib/utils/fileHelpers";

type CategoryModalProps = {
  files: File[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { category: Category; tags: string[]; expiryDate: string | null }[]) => void;
};

export function CategoryModal({ files, open, onClose, onConfirm }: CategoryModalProps) {
  const [category, setCategory] = useState<Category>("Other");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [expiryDate, setExpiryDate] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleConfirm = () => {
    const data = files.map(() => ({
      category,
      tags,
      expiryDate: expiryDate || null,
    }));
    onConfirm(data);
    setTags([]);
    setTagInput("");
    setExpiryDate("");
    setCategory("Other");
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
            className="relative w-full max-w-md vault-panel p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-medium text-[rgb(var(--color-text))]">
                Organize your {files.length > 1 ? `${files.length} files` : "file"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* file preview chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {files.map((file, i) => {
                const Icon = getFileIcon(file.name);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[rgb(var(--color-accent))]/6 text-xs text-[rgb(var(--color-text-muted))]"
                  >
                    <Icon size={13} className="text-[rgb(var(--color-accent))]" />
                    <span className="max-w-[120px] truncate">{file.name}</span>
                  </div>
                );
              })}
            </div>

            {/* category select */}
            <div className="mb-5">
              <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 ${
                      category === cat
                        ? "bg-[rgb(var(--color-accent))] text-white"
                        : "bg-[rgb(var(--color-accent))]/8 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/15"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* tags */}
            <div className="mb-5">
              <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-2 block">
                Tags <span className="text-[rgb(var(--color-text-muted))] font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Tag
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] pointer-events-none"
                />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag, press Enter"
                  className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-[rgb(var(--color-bg))] text-sm outline-none focus:border-[rgb(var(--color-accent))]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent))] transition-colors cursor-pointer z-10"
                >
                  <Plus size={16} />
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgb(var(--color-accent))]/10 text-xs text-[rgb(var(--color-accent))]"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X size={11} />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>

            {/* expiry date */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-2 block">
                Expiry date <span className="text-[rgb(var(--color-text-muted))] font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-[rgb(var(--color-bg))] text-sm outline-none focus:border-[rgb(var(--color-accent))]/50 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/20 text-sm font-medium text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-accent))]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn-shimmer flex-1 py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium hover:brightness-110 transition-all"
              >
                Upload {files.length > 1 ? `${files.length} files` : "file"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}