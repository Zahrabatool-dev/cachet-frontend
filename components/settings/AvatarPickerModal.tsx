"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { getAvatarUrl, generateSeedBatch } from "@/lib/avatars";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";

type AvatarPickerModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AvatarPickerModal({ open, onClose }: AvatarPickerModalProps) {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  const [seeds, setSeeds] = useState<string[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setSeeds(generateSeedBatch(12));
      setSelectedUrl(user?.avatar || null);
    }
  }, [open, user?.avatar]);

  const handleShuffle = () => {
    setSeeds(generateSeedBatch(12));
  };

  const handleSave = async () => {
    if (!selectedUrl) return;
    setIsSaving(true);
    try {
      const res = await api.put("/users/profile", { avatar: selectedUrl });
      const updatedUser = res.data.user || { ...user, avatar: selectedUrl };
      if (token) setAuth(token, updatedUser);
      toast.success("Avatar updated");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Couldn't update avatar");
    } finally {
      setIsSaving(false);
    }
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
            className="relative w-full max-w-md vault-panel p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-medium text-[rgb(var(--color-text))]">
                Choose your avatar
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {seeds.map((seed) => {
                const url = getAvatarUrl(seed);
                const isSelected = selectedUrl === url;
                return (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setSelectedUrl(url)}
                    className="relative aspect-square rounded-full overflow-hidden transition-transform duration-200 hover:scale-105 bg-[rgb(var(--color-accent))]/6"
                    style={{
                      outline: isSelected ? "2.5px solid rgb(var(--color-accent))" : "none",
                      outlineOffset: 3,
                    }}
                  >
                    <img src={url} alt="Avatar option" className="w-full h-full" />
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-[rgb(var(--color-accent))] border-2 border-white"
                      >
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleShuffle}
              className="w-full mt-4 py-2 rounded-lg border border-[rgb(var(--color-accent))]/20 text-sm text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 hover:text-[rgb(var(--color-text))] transition-colors flex items-center justify-center gap-2"
            >
              <Shuffle size={14} /> Show more options
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !selectedUrl}
              className="btn-shimmer w-full mt-3 py-2.5 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 transition-all"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              Save avatar
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}