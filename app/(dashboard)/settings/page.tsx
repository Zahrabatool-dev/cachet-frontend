"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Lock, HardDrive, Loader2, Eye, EyeOff } from "lucide-react";
import { AvatarDisplay } from "@/components/shared/AvatarDisplay";
import { AvatarPickerModal } from "@/components/settings/AvatarPickerModal";
import { StorageRing } from "@/components/dashboard/StorageRing";
import { useAuthStore } from "@/lib/store";
import { useStorageStore } from "@/lib/storageStore";
import api from "@/lib/api";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const storageUsedMB = useStorageStore((state) => state.storageUsedMB);
  const storageLimitMB = useStorageStore((state) => state.storageLimitMB);

  const [name, setName] = useState(user?.name || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);

  const handleProfileSave = async () => {
    setIsSavingProfile(true);
    try {
      await api.put("/users/profile", { name });
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Couldn't update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) return;
    setIsChangingPw(true);
    try {
      await api.put("/users/password", { currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Couldn't change password");
    } finally {
      setIsChangingPw(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl md:text-3xl font-medium text-[rgb(var(--color-text))]">
          Settings
        </h1>
        <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
          Manage your account, security, and preferences.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="vault-panel p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-[rgb(var(--color-accent))]" />
            <h2 className="text-sm font-medium text-[rgb(var(--color-text))]">Profile</h2>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <button
              type="button"
              onClick={() => setAvatarModalOpen(true)}
              className="relative group"
            >
              <AvatarDisplay avatar={user?.avatar} name={user?.name} size={56} />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                <span className="opacity-0 group-hover:opacity-100 text-white text-[10px] font-medium transition-opacity">
                  Change
                </span>
              </div>
            </button>
            <div>
              <p className="text-sm font-medium text-[rgb(var(--color-text))]">{user?.name}</p>
              <p className="text-xs text-[rgb(var(--color-text-muted))]">{user?.email}</p>
            </div>
          </div>

          <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 block">
            Display name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-[rgb(var(--color-bg))] text-sm outline-none focus:border-[rgb(var(--color-accent))]/50 transition-colors"
          />
          <button
            onClick={handleProfileSave}
            disabled={isSavingProfile || name === user?.name}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            {isSavingProfile && <Loader2 size={14} className="animate-spin" />}
            Save changes
          </button>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="vault-panel p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lock size={16} className="text-[rgb(var(--color-accent))]" />
            <h2 className="text-sm font-medium text-[rgb(var(--color-text))]">Password</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 block">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-[rgb(var(--color-bg))] text-sm outline-none focus:border-[rgb(var(--color-accent))]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
                  tabIndex={-1}
                >
                  {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 block">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[rgb(var(--color-accent))]/20 bg-[rgb(var(--color-bg))] text-sm outline-none focus:border-[rgb(var(--color-accent))]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
                  tabIndex={-1}
                >
                  {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={isChangingPw || !currentPassword || !newPassword}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--color-accent))] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            {isChangingPw && <Loader2 size={14} className="animate-spin" />}
            Update password
          </button>
        </motion.div>

        {/* Storage */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="vault-panel p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <HardDrive size={16} className="text-[rgb(var(--color-accent))]" />
            <h2 className="text-sm font-medium text-[rgb(var(--color-text))]">Storage</h2>
          </div>
          <StorageRing usedMB={storageUsedMB} totalMB={storageLimitMB} />
        </motion.div>
      </div>

      <AvatarPickerModal open={avatarModalOpen} onClose={() => setAvatarModalOpen(false)} />
    </div>
  );
}