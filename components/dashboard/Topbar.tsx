"use client";

import { useState, useEffect } from "react";
import { Menu, Search, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useStorageStore } from "@/lib/storageStore";
import { AvatarDisplay } from "@/components/shared/AvatarDisplay";
import Link from "next/link";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAuthStore((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const storageUsedMB = useStorageStore((state) => state.storageUsedMB);
  const storageLimitMB = useStorageStore((state) => state.storageLimitMB);
  const fetchStorage = useStorageStore((state) => state.fetchStorage);

  useEffect(() => {
    fetchStorage();
  }, [fetchStorage]);

  const storagePercent = Math.round((storageUsedMB / storageLimitMB) * 100);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 py-4 border-b border-[rgb(var(--color-accent))]/10 bg-white/70 backdrop-blur-lg">
      <button
        onClick={onMenuClick}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/8"
      >
        <Menu size={18} />
      </button>

      <div className="relative flex-1 min-w-0 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
        />
        <input
          type="text"
          placeholder="Search documents..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-[rgb(var(--color-accent))]/15 bg-[rgb(var(--color-bg))] text-sm outline-none focus:border-[rgb(var(--color-accent))]/40 transition-colors"
        />
      </div>

      <div className="flex-1" />

      <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[rgb(var(--color-accent))]/6">
        <div className="w-16 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${storagePercent}%`,
              background:
                storagePercent > 85
                  ? "#dc2626"
                  : storagePercent > 60
                  ? "#f59e0b"
                  : "rgb(var(--color-accent))",
            }}
          />
        </div>
        <span className="text-xs text-[rgb(var(--color-text-muted))] whitespace-nowrap">
          {storageUsedMB.toFixed(0)}MB / {(storageLimitMB / 1024).toFixed(0)}GB
        </span>
      </div>

      <div className="relative">
        <button
  onClick={() => setDropdownOpen((v) => !v)}
  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[rgb(var(--color-accent))]/6 transition-colors"
>
  <AvatarDisplay avatar={user?.avatar} name={user?.name} size={32} />
  <ChevronDown size={14} className="text-[rgb(var(--color-text-muted))] hidden sm:block" />
</button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 vault-panel-static py-1.5 z-40">
            <div className="px-3.5 py-2 border-b border-[rgb(var(--color-accent))]/10">
              <p className="text-sm font-medium text-[rgb(var(--color-text))] truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-[rgb(var(--color-text-muted))] truncate">
                {user?.email}
              </p>
            </div>
           <Link
  href="/settings"
  className="block px-3.5 py-2 text-sm text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 hover:text-[rgb(var(--color-text))]"
>
  Settings
</Link>
          </div>
        )}
      </div>
    </header>
  );
}