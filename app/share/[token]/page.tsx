"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, AlertCircle, ShieldOff, FileText } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { getFileIcon } from "@/lib/utils/fileHelpers";
import api from "@/lib/api";

type SharedDocument = {
  title: string;
  fileUrl: string;
  fileType: string;
  category: string;
};

type ViewState = "loading" | "password" | "viewing" | "expired" | "invalid" | "wrong-password";

export default function PublicSharePage() {
  const params = useParams();
  const token = params.token as string;

  const [state, setState] = useState<ViewState>("loading");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [document, setDocument] = useState<SharedDocument | null>(null);

  const attemptAccess = async (pwd?: string) => {
    try {
      const res = await api.post(`/share/access/${token}`, pwd ? { password: pwd } : {});
      setDocument(res.data.document);
      setState("viewing");
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 && err?.response?.data?.requiresPassword) {
        setState("password");
      } else if (status === 401) {
        setState("wrong-password");
      } else if (status === 410) {
        setState("expired");
      } else {
        setState("invalid");
      }
    }
  };

  useEffect(() => {
    attemptAccess();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await attemptAccess(password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] flex flex-col items-center px-6 py-12">
      <Logo />

      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {state === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader2 size={24} className="animate-spin text-[rgb(var(--color-accent))]" />
            </motion.div>
          )}

          {state === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="vault-panel p-8 w-full max-w-sm text-center"
            >
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-[rgb(var(--color-accent))]/10">
                <Lock size={20} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
              </div>
              <h1 className="mt-4 font-display text-lg font-medium text-[rgb(var(--color-text))]">
                This document is protected
              </h1>
              <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
                Enter the password to view it.
              </p>

              <form onSubmit={handlePasswordSubmit} className="mt-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-[rgb(var(--color-bg))] text-sm text-center outline-none focus:border-[rgb(var(--color-accent))]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !password}
                  className="btn-shimmer w-full mt-3 py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                >
                  {isSubmitting ? "Checking..." : "Unlock document"}
                </button>
              </form>
            </motion.div>
          )}

          {state === "wrong-password" && (
            <motion.div
              key="wrong-password"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="vault-panel p-8 w-full max-w-sm text-center"
            >
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
                <Lock size={20} className="text-red-500" strokeWidth={1.75} />
              </div>
              <h1 className="mt-4 font-display text-lg font-medium text-[rgb(var(--color-text))]">
                Incorrect password
              </h1>
              <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">Try again.</p>

              <form onSubmit={handlePasswordSubmit} className="mt-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-lg border border-red-200 bg-[rgb(var(--color-bg))] text-sm text-center outline-none focus:border-red-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !password}
                  className="btn-shimmer w-full mt-3 py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium disabled:opacity-50 hover:brightness-110 transition-all"
                >
                  {isSubmitting ? "Checking..." : "Try again"}
                </button>
              </form>
            </motion.div>
          )}

          {state === "expired" && (
            <motion.div key="expired" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="vault-panel p-8 w-full max-w-sm text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-amber-50">
                <AlertCircle size={20} className="text-amber-500" strokeWidth={1.75} />
              </div>
              <h1 className="mt-4 font-display text-lg font-medium text-[rgb(var(--color-text))]">
                This link has expired
              </h1>
              <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
                Ask the sender for a new share link.
              </p>
            </motion.div>
          )}

          {state === "invalid" && (
            <motion.div key="invalid" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="vault-panel p-8 w-full max-w-sm text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100">
                <ShieldOff size={20} className="text-[rgb(var(--color-text-muted))]" strokeWidth={1.75} />
              </div>
              <h1 className="mt-4 font-display text-lg font-medium text-[rgb(var(--color-text))]">
                Invalid link
              </h1>
              <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
                This share link doesn't exist or has been revoked.
              </p>
            </motion.div>
          )}

          {state === "viewing" && document && (
            <SharedDocumentView doc={document} />
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-[rgb(var(--color-text-muted))] font-mono">
        Shared securely via Cachet · Encrypted at rest
      </p>
    </div>
  );
}

function SharedDocumentView({ doc }: { doc: SharedDocument }) {
  const Icon = getFileIcon(doc.title);
  const isImage = doc.fileType.startsWith("image/");
  const isPdf = doc.fileType === "application/pdf";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="vault-panel p-6 w-full max-w-2xl"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[rgb(var(--color-accent))]/10 shrink-0">
          <Icon size={18} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-base font-medium text-[rgb(var(--color-text))] truncate">
            {doc.title}
          </h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">{doc.category}</p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-[rgb(var(--color-bg))] flex items-center justify-center min-h-[300px]">
        {isImage ? (
          <img src={doc.fileUrl} alt={doc.title} className="max-w-full max-h-[500px] object-contain" />
        ) : isPdf ? (
          <iframe src={doc.fileUrl} className="w-full h-[500px] border-0" title={doc.title} />
        ) : (
          <div className="text-center py-16">
            <FileText size={40} className="mx-auto text-[rgb(var(--color-accent))]/30" strokeWidth={1} />
            <p className="mt-3 text-sm text-[rgb(var(--color-text-muted))]">Preview not available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}