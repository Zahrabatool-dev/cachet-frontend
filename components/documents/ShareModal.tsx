"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link2, Lock, Copy, Check, Loader2, Clock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

type ShareModalProps = {
  documentId: string;
  documentTitle: string;
  open: boolean;
  onClose: () => void;
};

const EXPIRY_OPTIONS = [
  { label: "1 hour", hours: 1 },
  { label: "24 hours", hours: 24 },
  { label: "7 days", hours: 24 * 7 },
  { label: "30 days", hours: 24 * 30 },
];

export function ShareModal({ documentId, documentTitle, open, onClose }: ShareModalProps) {
  const [mounted, setMounted] = useState(false);
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setShareUrl(null);
        setUsePassword(false);
        setPassword("");
        setShowPassword(false);
        setExpiresInHours(24);
        setCopied(false);
      }, 200);
    }
  }, [open]);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const res = await api.post(`/share/create/${documentId}`, {
        expiresInHours,
        password: usePassword && password ? password : undefined,
      });
      setShareUrl(res.data.shareUrl);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Couldn't create share link");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
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
            className="relative w-full max-w-md vault-panel p-6"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-lg font-medium text-[rgb(var(--color-text))]">
                Share document
              </h2>
              <button type="button" onClick={onClose} className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-[rgb(var(--color-text-muted))] mb-5 truncate">{documentTitle}</p>

            <AnimatePresence mode="wait">
              {!shareUrl ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-5">
                    <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-2 flex items-center gap-1.5">
                      <Clock size={14} /> Link expires in
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {EXPIRY_OPTIONS.map((opt) => (
                        <button
                          key={opt.hours}
                          type="button"
                          onClick={() => setExpiresInHours(opt.hours)}
                          className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            expiresInHours === opt.hours
                              ? "bg-[rgb(var(--color-accent))] text-white"
                              : "bg-[rgb(var(--color-accent))]/8 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/15"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium text-[rgb(var(--color-text))] flex items-center gap-1.5">
                        <Lock size={14} /> Password protect
                      </span>
                    <button
  type="button"
  onClick={() => setUsePassword((v) => !v)}
  style={{
    position: "relative",
    width: "42px",
    height: "24px",
    borderRadius: "9999px",
    flexShrink: 0,
    backgroundColor: usePassword ? "rgb(31, 77, 61)" : "#d4d4d4",
    transition: "background-color 0.2s",
    border: "none",
    cursor: "pointer",
    padding: 0,
  }}
>
  <span
    style={{
      position: "absolute",
      top: "2px",
      left: "2px",
      width: "20px",
      height: "20px",
      borderRadius: "9999px",
      backgroundColor: "white",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      transform: usePassword ? "translateX(18px)" : "translateX(0px)",
      transition: "transform 0.2s",
    }}
  />
</button>
                    </label>

                    <AnimatePresence>
                      {usePassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="relative"
                        >
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Set a password"
                            autoComplete="new-password"
                            className="share-password-input w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-[rgb(var(--color-bg))] text-sm outline-none focus:border-[rgb(var(--color-accent))]/50 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent))] transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={isCreating || (usePassword && !password)}
                    className="btn-shimmer w-full py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Creating link...
                      </>
                    ) : (
                      <>
                        <Link2 size={16} /> Generate share link
                      </>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[rgb(var(--color-accent))]/10">
                      <Check size={22} className="text-[rgb(var(--color-accent))]" strokeWidth={2} />
                    </div>
                  </div>
                  <p className="text-center text-sm text-[rgb(var(--color-text-muted))] mb-4">
                    Your share link is ready
                  </p>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-[rgb(var(--color-bg))]">
                    <input
                      readOnly
                      value={shareUrl}
                      className="flex-1 min-w-0 bg-transparent text-xs text-[rgb(var(--color-text-muted))] outline-none truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgb(var(--color-accent))] text-white text-xs font-medium hover:brightness-110 transition-all"
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
                            <Check size={12} /> Copied
                          </motion.span>
                        ) : (
                          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
                            <Copy size={12} /> Copy
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShareUrl(null)}
                    className="w-full mt-4 py-2 text-sm text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent))] transition-colors"
                  >
                    Create another link
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}