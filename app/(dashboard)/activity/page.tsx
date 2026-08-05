"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Activity as ActivityIcon, Upload, Eye, Share2, Trash2, Download } from "lucide-react";
import api from "@/lib/api";

type ActivityLog = {
  _id: string;
  documentId: { _id: string; title: string; category: string } | string;
  action: "upload" | "view" | "share" | "delete" | "download";
  timestamp: string;
};

const actionConfig = {
  upload: { icon: Upload, label: "Uploaded", color: "rgb(var(--color-accent))" },
  view: { icon: Eye, label: "Viewed", color: "#6B7570" },
  share: { icon: Share2, label: "Shared", color: "#f59e0b" },
  delete: { icon: Trash2, label: "Deleted", color: "#dc2626" },
  download: { icon: Download, label: "Downloaded", color: "rgb(var(--color-accent))" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function groupByDate(logs: ActivityLog[]) {
  const groups: Record<string, ActivityLog[]> = {};
  logs.forEach((log) => {
    const date = new Date(log.timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let key: string;
    if (date.toDateString() === today.toDateString()) {
      key = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = "Yesterday";
    } else {
      key = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(log);
  });
  return groups;
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/documents/dashboard/activity-logs");
        setLogs(res.data.logs || []);
      } catch (err) {
        toast.error("Couldn't load activity");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const grouped = groupByDate(logs);

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl md:text-3xl font-medium text-[rgb(var(--color-text))]">
          Activity
        </h1>
        <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
          A history of everything that's happened in your vault.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="vault-panel-static h-16 animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="vault-panel p-12 text-center"
        >
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-[rgb(var(--color-accent))]/10">
            <ActivityIcon size={20} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
          </div>
          <h3 className="mt-4 font-display text-base font-medium text-[rgb(var(--color-text))]">
            No activity yet
          </h3>
          <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
            Upload, share, or view a document to see it show up here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, dateLogs], groupIdx) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: groupIdx * 0.08 }}
            >
              <h2 className="text-xs font-medium tracking-wide uppercase text-[rgb(var(--color-text-muted))] mb-3">
                {date}
              </h2>

              <div className="relative vault-panel p-5">
                <div className="absolute left-[35px] top-7 bottom-7 w-px bg-[rgb(var(--color-accent))]/15" />

                <div className="space-y-5">
                  {dateLogs.map((log, i) => {
                    const config = actionConfig[log.action];
                    const Icon = config.icon;
                    const docTitle =
                      log.documentId && typeof log.documentId === "object"
                        ? log.documentId.title
                        : "a deleted document";
                    const docId =
                      log.documentId && typeof log.documentId === "object"
                        ? log.documentId._id
                        : null;

                    return (
                      <motion.div
                        key={log._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="relative flex items-start gap-3 group"
                      >
                        <div
                          className="relative z-10 shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-white border-2 transition-transform duration-200 group-hover:scale-110"
                          style={{ borderColor: config.color }}
                        >
                          <Icon size={13} style={{ color: config.color }} strokeWidth={2} />
                        </div>
                        <div className="pt-0.5 min-w-0">
                          {docId ? (
                            <a
                              href={`/documents/${docId}`}
                              className="text-sm text-[rgb(var(--color-text))] hover:text-[rgb(var(--color-accent))] transition-colors"
                            >
                              {config.label}{" "}
                              <span className="font-medium">{docTitle}</span>
                            </a>
                          ) : (
                            <p className="text-sm text-[rgb(var(--color-text-muted))]">
                              {config.label} <span className="italic">{docTitle}</span>
                            </p>
                          )}
                          <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5">
                            {timeAgo(log.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}