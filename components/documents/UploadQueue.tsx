"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, RotateCw } from "lucide-react";
import { getFileIcon, formatFileSize } from "@/lib/utils/fileHelpers";

export type QueuedFile = {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  errorMessage?: string;
};

type UploadQueueProps = {
  files: QueuedFile[];
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
};

function ProgressItem({
  item,
  onRemove,
  onRetry,
}: {
  item: QueuedFile;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  const Icon = getFileIcon(item.file.name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
      className="vault-panel-static p-3.5 flex items-center gap-3"
    >
      <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-[rgb(var(--color-accent))]/10">
        <Icon size={16} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-[rgb(var(--color-text))] truncate">
            {item.file.name}
          </p>
          <span className="text-xs text-[rgb(var(--color-text-muted))] shrink-0">
            {formatFileSize(item.file.size)}
          </span>
        </div>

        {item.status === "error" ? (
          <p className="mt-1 text-xs text-red-500">
            {item.errorMessage || "Upload failed"} -{" "}
            <button
              onClick={() => onRetry(item.id)}
              className="underline hover:text-red-600 font-medium"
            >
              tap to retry
            </button>
          </p>
        ) : (
          <div className="mt-1.5 h-1 rounded-full bg-neutral-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  item.status === "success"
                    ? "rgb(var(--color-accent))"
                    : "rgb(var(--color-accent) / 0.6)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${item.progress}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-1.5">
        <AnimatePresence mode="wait">
          {item.status === "success" ? (
            <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle2 size={18} className="text-[rgb(var(--color-accent))]" />
            </motion.div>
          ) : item.status === "error" ? (
            <motion.div key="err" className="flex items-center gap-1.5" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <button
                onClick={() => onRetry(item.id)}
                className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent))] transition-colors"
                title="Retry upload"
              >
                <RotateCw size={16} />
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="text-[rgb(var(--color-text-muted))] hover:text-red-500 transition-colors"
                title="Remove"
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="cancel"
              onClick={() => onRemove(item.id)}
              className="text-[rgb(var(--color-text-muted))] hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function UploadQueue({ files, onRemove, onRetry }: UploadQueueProps) {
  if (files.length === 0) return null;

  return (
    <div className="mt-4 space-y-2.5">
      <AnimatePresence mode="popLayout">
        {files.map((item) => (
          <ProgressItem key={item.id} item={item} onRemove={onRemove} onRetry={onRetry} />
        ))}
      </AnimatePresence>
    </div>
  );
}