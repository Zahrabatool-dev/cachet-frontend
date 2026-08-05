"use client";

import { motion } from "framer-motion";
import { MoreVertical, Share2, Download, Trash2, Clock, Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFileIcon, formatFileSize } from "@/lib/utils/fileHelpers";


export type Document = {
  _id: string;
  title: string;
  category: string;
  fileType: string;
  fileSize: number;
  tags: string[];
  expiryDate: string | null;
  createdAt: string;
  fileUrl?: string; // optional until confirmed — thumbnails/download degrade gracefully without it
};

type DocumentCardProps = {
  doc: Document;
  view: "grid" | "list";
  onDelete: (id: string) => void;
  onShare?: (doc: Document) => void;
  onRename?: (doc: Document) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
};

function isImageFile(doc: Document) {
  return doc.fileType?.startsWith("image/");
}

export function DocumentCard({ doc, view, onDelete, onShare, onRename, selectionMode, selected, onToggleSelect }: DocumentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const Icon = getFileIcon(doc.title);

  const handleCardClick = () => {
    if (selectionMode) {
      onToggleSelect?.(doc._id);
    } else {
      router.push(`/documents/${doc._id}`);
    }
  };

  const isExpiringSoon =
    doc.expiryDate &&
    new Date(doc.expiryDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

  const handleDownload = () => {
    if (!doc.fileUrl) return;
    // Cloudinary serves files inline by default for cross-origin requests,
    // so the browser opens them instead of saving them. Inserting
    // "fl_attachment" into the URL tells Cloudinary to send proper
    // Content-Disposition: attachment headers, which forces a real download.
    const downloadUrl = doc.fileUrl.includes("/upload/")
      ? doc.fileUrl.replace("/upload/", "/upload/fl_attachment/")
      : doc.fileUrl;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = doc.title;
    link.click();
  };

  const formattedDate = new Date(doc.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // --- LIST VIEW: real table row, meant to sit inside <table><tbody> in the parent ---
  if (view === "list") {
    return (
      <motion.tr
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        onClick={handleCardClick}
        className="group border-b border-[rgb(var(--color-accent))]/8 last:border-none hover:bg-[rgb(var(--color-accent))]/[0.03] transition-colors cursor-pointer"
      >
        <td className="py-3 pl-4 pr-3">
  <div className="flex items-center gap-3 min-w-0">
    {selectionMode && (
      <input
        type="checkbox"
        className="vault-checkbox shrink-0"
        checked={selected}
        onChange={() => onToggleSelect?.(doc._id)}
        onClick={(e) => e.stopPropagation()}
      />
    )}
    <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-[rgb(var(--color-accent))]/10 overflow-hidden">
      {isImageFile(doc) && doc.fileUrl ? (
        <img src={doc.fileUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <Icon size={16} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
      )}
    </div>
    <span className="text-sm font-medium text-[rgb(var(--color-text))] truncate">
      {doc.title}
    </span>
  </div>
</td>
        <td className="py-3 px-3 text-sm text-[rgb(var(--color-text-muted))] capitalize whitespace-nowrap">
          {doc.category}
        </td>
        <td className="py-3 px-3 text-sm text-[rgb(var(--color-text-muted))] whitespace-nowrap">
          {formatFileSize(doc.fileSize)}
        </td>
        <td className="py-3 px-3 whitespace-nowrap">
          {doc.expiryDate ? (
            <span className={`text-sm ${isExpiringSoon ? "text-amber-600 flex items-center gap-1" : "text-[rgb(var(--color-text-muted))]"}`}>
              {isExpiringSoon && <Clock size={12} />}
              {new Date(doc.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          ) : (
            <span className="text-sm text-[rgb(var(--color-text-muted))]">—</span>
          )}
        </td>
        <td className="py-3 px-3 text-sm text-[rgb(var(--color-text-muted))] whitespace-nowrap hidden lg:table-cell">
          {formattedDate}
        </td>
        <td className="py-3 pr-4 pl-3 text-right">
          <CardMenu
            open={menuOpen}
            setOpen={setMenuOpen}
            onDelete={() => onDelete(doc._id)}
            onDownload={doc.fileUrl ? handleDownload : undefined}
            onShare={onShare ? () => onShare(doc) : undefined}
            onRename={onRename ? () => onRename(doc) : undefined}
          />
        </td>
      </motion.tr>
    );
  }

  // --- GRID VIEW ---
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={handleCardClick}
      className={`group vault-panel p-4 relative cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[rgb(var(--color-accent))]/40 ${
        menuOpen ? "-translate-y-1 shadow-lg border-[rgb(var(--color-accent))]/40" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {selectionMode && (
            <input
              type="checkbox"
              className="vault-checkbox"
              checked={selected}
              onChange={() => onToggleSelect?.(doc._id)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[rgb(var(--color-accent))]/10 overflow-hidden transition-transform duration-300 group-hover:scale-110">
            {isImageFile(doc) && doc.fileUrl ? (
              <img src={doc.fileUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Icon size={18} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
            )}
          </div>
        </div>
        {!selectionMode && (
          <CardMenu
            open={menuOpen}
            setOpen={setMenuOpen}
            onDelete={() => onDelete(doc._id)}
            onDownload={doc.fileUrl ? handleDownload : undefined}
            onShare={onShare ? () => onShare(doc) : undefined}
            onRename={onRename ? () => onRename(doc) : undefined}
          />
        )}
      </div>

      <p className="mt-3.5 text-sm font-medium text-[rgb(var(--color-text))] truncate">
        {doc.title}
      </p>
      <p className="mt-1 text-xs text-[rgb(var(--color-text-muted))] capitalize">
        {doc.category} · {formatFileSize(doc.fileSize)}
      </p>

      {doc.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {doc.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-[rgb(var(--color-accent))]/8 text-[10px] text-[rgb(var(--color-text-muted))]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {isExpiringSoon && (
        <span className="mt-2.5 flex items-center gap-1 text-xs text-amber-600">
          <Clock size={12} /> Expiring soon
        </span>
      )}
    </motion.div>
  );
}

function CardMenu({
  open,
  setOpen,
  onDelete,
  onDownload,
  onShare,
  onRename,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onDelete: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onRename?: () => void;
}) {
  return (
    <div className="relative shrink-0">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={`flex items-center justify-center w-7 h-7 rounded-md text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/8 hover:text-[rgb(var(--color-text))] transition-all ${
          open ? "opacity-100 bg-[rgb(var(--color-accent))]/8" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 w-40 vault-panel-static py-1.5 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onRename?.();
              }}
              disabled={!onRename}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 hover:text-[rgb(var(--color-text))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Pencil size={14} /> Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onShare?.();
              }}
              disabled={!onShare}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 hover:text-[rgb(var(--color-text))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Share2 size={14} /> Share
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onDownload?.();
              }}
              disabled={!onDownload}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 hover:text-[rgb(var(--color-text))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onDelete();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}