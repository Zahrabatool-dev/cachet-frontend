// app/(dashboard)/shared/page.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Share2, Copy, Trash2, Clock, Loader2 } from "lucide-react";
import { getFileIcon } from "@/lib/utils/fileHelpers";
import api from "@/lib/api";

type ShareLink = {
  _id: string;
  token: string;
  expiresAt: string;
  accessCount: number;
  password: string | null;
  createdAt: string;
  documentTitle: string;
  documentId: string;
};

export default function SharedPage() {
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllShareLinks = async () => {
      try {
        const docsRes = await api.get("/documents");
        const documents = docsRes.data.documents || docsRes.data;

        const linkResults = await Promise.all(
          documents.map(async (doc: any) => {
            try {
              const res = await api.get(`/share/document/${doc._id}`);
              return (res.data.shareLinks || []).map((link: any) => ({
                ...link,
                documentTitle: doc.title,
                documentId: doc._id,
              }));
            } catch {
              return [];
            }
          })
        );

        const allLinks = linkResults.flat();
        // sirf active (expire na hue) links dikhao
        const activeLinks = allLinks.filter(
          (link: ShareLink) => new Date(link.expiresAt) > new Date()
        );
        setLinks(activeLinks);
      } catch (err) {
        toast.error("Couldn't load shared links");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllShareLinks();
  }, []);

  const handleRevoke = async (linkId: string) => {
    setRevokingId(linkId);
    try {
      await api.delete(`/share/${linkId}`);
      setLinks((prev) => prev.filter((l) => l._id !== linkId));
      toast.success("Share link revoked");
    } catch (err) {
      toast.error("Couldn't revoke link");
    } finally {
      setRevokingId(null);
    }
  };

  const handleCopy = (token: string) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl md:text-3xl font-medium text-[rgb(var(--color-text))]">
          Shared
        </h1>
        <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
          Manage active share links for your documents.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="vault-panel-static h-20 animate-pulse" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vault-panel p-12 text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-[rgb(var(--color-accent))]/10">
            <Share2 size={20} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
          </div>
          <h3 className="mt-4 font-display text-base font-medium text-[rgb(var(--color-text))]">
            No active share links
          </h3>
          <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
            Share a document to see its link here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {links.map((link, i) => {
            const Icon = getFileIcon(link.documentTitle);
            return (
              <motion.div
                key={link._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="vault-panel-static p-4 flex items-center gap-4"
              >
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-[rgb(var(--color-accent))]/10">
                  <Icon size={18} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[rgb(var(--color-text))] truncate">
                    {link.documentTitle}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-[rgb(var(--color-text-muted))]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> Expires {new Date(link.expiresAt).toLocaleDateString()}
                    </span>
                    <span>{link.accessCount} views</span>
                    {link.password && <span>🔒 Protected</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(link.token)}
                  className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/8 hover:text-[rgb(var(--color-accent))] transition-colors"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={() => handleRevoke(link._id)}
                  disabled={revokingId === link._id}
                  className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-[rgb(var(--color-text-muted))] hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  {revokingId === link._id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}