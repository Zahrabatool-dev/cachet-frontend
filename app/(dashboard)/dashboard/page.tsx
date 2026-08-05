"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, Share2, TrendingUp, Upload } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StorageRing } from "@/components/dashboard/StorageRing";
import { RecentlyViewed } from "@/components/dashboard/RecentlyViewed";
import { useAuthStore } from "@/lib/store";
import { useStorageStore } from "@/lib/storageStore";
import Link from "next/link";
import api from "@/lib/api";

type DocStats = {
  totalDocuments: number;
  expiringSoon: number;
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.split(" ")[0] || "there";

  const storageUsedMB = useStorageStore((state) => state.storageUsedMB);
  const storageLimitMB = useStorageStore((state) => state.storageLimitMB);
  const fetchStorage = useStorageStore((state) => state.fetchStorage);

  const [docStats, setDocStats] = useState<DocStats>({ totalDocuments: 0, expiringSoon: 0 });

  useEffect(() => {
    fetchStorage(); // agar Topbar ne already fetch kar liya, ye no-op hoga (isLoaded check)

    const fetchDocStats = async () => {
      try {
        const [docsRes, expiringRes] = await Promise.all([
          api.get("/documents"),
          api.get("/documents/dashboard/expiring-soon"),
        ]);

        setDocStats({
          totalDocuments: docsRes.data.count ?? docsRes.data.documents?.length ?? 0,
          expiringSoon: expiringRes.data.documents?.length ?? 0,
        });
      } catch (err) {
        console.error("Failed to load document stats", err);
      }
    };

    fetchDocStats();
  }, [fetchStorage]);

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="absolute inset-0 -z-10 scatter-dots opacity-[0.15] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-[rgb(var(--color-text))]">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
            Here's what's happening in your vault today.
          </p>
        </div>

       <Link
  href="/documents"
  className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium hover:brightness-110 transition-all duration-200 shrink-0"
>
  <Upload size={16} strokeWidth={2} />
  Upload document
</Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total documents" value={docStats.totalDocuments} delay={0} />
        <StatCard icon={Clock} label="Expiring soon" value={docStats.expiringSoon} delay={0.1} />
        <StatCard icon={Share2} label="Active share links" value={0} delay={0.2} />
        <StorageRing usedMB={storageUsedMB} totalMB={storageLimitMB} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentlyViewed />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 vault-panel p-8 text-center relative overflow-hidden"
      >
        <div className="guilloche absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-[rgb(var(--color-accent))]/10">
          <TrendingUp size={20} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
        </div>
        <h3 className="relative mt-4 font-display text-base font-medium text-[rgb(var(--color-text))]">
          {docStats.totalDocuments === 0 ? "Recent activity will show up here" : "You're all caught up"}
        </h3>
        <p className="relative mt-1.5 text-sm text-[rgb(var(--color-text-muted))] max-w-sm mx-auto">
          {docStats.totalDocuments === 0
            ? "Upload your first document to start seeing activity and stats."
            : "Check the Activity page for your full document history."}
        </p>
      </motion.div>
    </div>
  );
}