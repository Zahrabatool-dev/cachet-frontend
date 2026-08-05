"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { getFileIcon } from "@/lib/utils/fileHelpers";
import api from "@/lib/api";

type ViewedDoc = {
  documentId: string;
  title: string;
  category: string;
  timestamp: string;
};

export function RecentlyViewed() {
  const [docs, setDocs] = useState<ViewedDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get("/documents/dashboard/activity-logs");
        const logs = res.data.logs || [];

        const seen = new Set<string>();
        const recent: ViewedDoc[] = [];

        for (const log of logs) {
          if (log.action !== "view" || !log.documentId || typeof log.documentId !== "object") continue;
          const id = log.documentId._id;
          if (seen.has(id)) continue;
          seen.add(id);
          recent.push({
            documentId: id,
            title: log.documentId.title,
            category: log.documentId.category,
            timestamp: log.timestamp,
          });
          if (recent.length >= 5) break;
        }

        setDocs(recent);
      } catch (err) {
        // silent fail — non-critical widget
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (isLoading) {
    return (
      <div className="vault-panel p-5">
        <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse mb-4" />
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (docs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="vault-panel p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Eye size={14} className="text-[rgb(var(--color-accent))]" />
        <h2 className="text-sm font-medium text-[rgb(var(--color-text))]">Recently viewed</h2>
      </div>

      <div className="space-y-1">
        {docs.map((doc, i) => {
          const Icon = getFileIcon(doc.title);
          return (
            <motion.div
              key={doc.documentId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/documents/${doc.documentId}`}
                className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[rgb(var(--color-accent))]/6 transition-colors"
              >
                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-[rgb(var(--color-accent))]/10">
                  <Icon size={14} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
                </div>
                <span className="text-sm text-[rgb(var(--color-text))] truncate group-hover:text-[rgb(var(--color-accent))] transition-colors">
                  {doc.title}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}