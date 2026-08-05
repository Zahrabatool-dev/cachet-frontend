"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Share2,
  Activity,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { useAuthStore } from "@/lib/store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Documents", href: "/documents", icon: FileText },
  { label: "Shared", href: "/shared", icon: Share2 },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
      className="hidden md:flex flex-col h-screen sticky top-0 border-r border-[rgb(var(--color-accent))]/10 bg-white/60 backdrop-blur-lg overflow-hidden"
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-5 py-5 shrink-0">
        <Link href="/dashboard" className={collapsed ? "opacity-0 w-0 overflow-hidden" : ""}>
          <Logo size="sm" />
        </Link>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/8 hover:text-[rgb(var(--color-accent))] transition-colors"
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                isActive
                  ? "bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))] font-medium"
                  : "text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 hover:text-[rgb(var(--color-text))]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[rgb(var(--color-accent))]"
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                />
              )}
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[rgb(var(--color-accent))]/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[rgb(var(--color-text-muted))] hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
}