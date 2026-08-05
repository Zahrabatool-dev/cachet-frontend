"use client";

import { motion } from "framer-motion";
import { Upload, Eye, Share2, Trash2, Download } from "lucide-react";

type ActivityLog = {
  _id: string;
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
  return `${days}d ago`;
}

export function ActivityTimeline({ logs }: { logs: ActivityLog[] }) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-[rgb(var(--color-text-muted))] text-center py-6">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <div className="relative pl-2">
      {/* vertical connecting line */}
      <div className="absolute left-[13px] top-2 bottom-2 w-px bg-[rgb(var(--color-accent))]/15" />

      <div className="space-y-5">
        {logs.map((log, i) => {
          const config = actionConfig[log.action];
          const Icon = config.icon;
          return (
            <motion.div
              key={log._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="relative flex items-start gap-3"
            >
              <div
                className="relative z-10 shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white border-2"
                style={{ borderColor: config.color }}
              >
                <Icon size={11} style={{ color: config.color }} strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <p className="text-sm text-[rgb(var(--color-text))]">{config.label}</p>
                <p className="text-xs text-[rgb(var(--color-text-muted))]">
                  {timeAgo(log.timestamp)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}