// hooks/useRequireAuth.ts — updated

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export function useRequireAuth() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Zustand persist ke rehydrate hone ka wait karo, tab tak redirect mat karo
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // agar already hydrate ho chuka hai (component dobara mount hua without reload)
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return unsub;
  }, []);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  // jab tak hydrate nahi hua, "authenticated" treat karo (loading state dikhao layout mein)
  return hasHydrated ? isAuthenticated : true;
}