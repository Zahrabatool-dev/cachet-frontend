import { FileText, FileImage, File as FileIcon, type LucideIcon } from "lucide-react";

export function getFileIcon(fileName: string): LucideIcon {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return FileText;
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")) return FileImage;
  return FileIcon;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const CATEGORIES = [
  "Identity",
  "Education",
  "Financial",
  "Medical",
  "Legal",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];