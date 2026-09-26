"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileArchive, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { CATEGORIES, type Category } from "@/lib/utils/fileHelpers";
import { useStorageStore } from "@/lib/storageStore";

type ZipUploadModalProps = {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
};

type Result = { created: string[]; skipped: { name: string; reason: string }[] } | null;

export function ZipUploadModal({ open, onClose, onImported }: ZipUploadModalProps) {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<Category>("Other");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFile(null);
        setResult(null);
        setProgress(0);
        setCategory("Other");
      }, 200);
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".zip")) setFile(f);
    else if (f) toast.error("Please select a .zip file");
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("zipFile", file);
    formData.append("category", category.toLowerCase());

    try {
      const res = await api.post("/documents/upload-zip", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / (e.total || 1)));
        },
      });
      setResult(res.data);
      toast.success(res.data.message);
      onImported();
      useStorageStore.setState({ isLoaded: false });
      useStorageStore.getState().fetchStorage();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Import failed");
    } finally {
      setIsUploading(false);
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
            className="relative w-full max-w-md vault-panel p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-medium text-[rgb(var(--color-text))] flex items-center gap-2">
                <FileArchive size={18} className="text-[rgb(var(--color-accent))]" /> Bulk import
              </h2>
              <button type="button" onClick={onClose} className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]">
                <X size={18} />
              </button>
            </div>

            {!result ? (
              <>
                <p className="text-sm text-[rgb(var(--color-text-muted))] mb-4">
                  Upload a .zip containing PDF, JPG, or PNG files - each one becomes a document.
                </p>

                <input ref={inputRef} type="file" accept=".zip" onChange={handleFileSelect} className="hidden" />

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[rgb(var(--color-accent))]/25 rounded-xl px-4 py-8 text-center hover:border-[rgb(var(--color-accent))]/50 transition-colors"
                >
                  <FileArchive size={28} className="mx-auto text-[rgb(var(--color-accent))]/50" strokeWidth={1.5} />
                  <p className="mt-3 text-sm text-[rgb(var(--color-text))]">
                    {file ? file.name : "Choose a .zip file"}
                  </p>
                </button>

                {file && (
                  <div className="mt-5">
                    <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-2 block">
                      Assign category to all files
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
                )}

                {isUploading && (
                  <div className="mt-5">
                    <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[rgb(var(--color-accent))]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-[rgb(var(--color-text-muted))] text-center">
                      Extracting and uploading files...
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="btn-shimmer w-full mt-5 py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 transition-all"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Importing...
                    </>
                  ) : (
                    "Import documents"
                  )}
                </button>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4 text-[rgb(var(--color-accent))]">
                  <CheckCircle2 size={18} />
                  <p className="text-sm font-medium">{result.created.length} document(s) imported</p>
                </div>

                {result.created.length > 0 && (
                  <div className="mb-4 max-h-32 overflow-y-auto space-y-1">
                    {result.created.map((name) => (
                      <p key={name} className="text-xs text-[rgb(var(--color-text-muted))] truncate">
                        ✓ {name}
                      </p>
                    ))}
                  </div>
                )}

                {result.skipped.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 text-amber-600 mb-1.5">
                      <AlertCircle size={14} />
                      <p className="text-xs font-medium">{result.skipped.length} skipped</p>
                    </div>
                    <div className="max-h-24 overflow-y-auto space-y-1">
                      {result.skipped.map((s, i) => (
                        <p key={i} className="text-xs text-[rgb(var(--color-text-muted))] truncate">
                          {s.name} — {s.reason}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium hover:brightness-110 transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}