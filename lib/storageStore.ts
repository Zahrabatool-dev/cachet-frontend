import { create } from "zustand";
import api from "./api";

type StorageState = {
  storageUsedMB: number;
  storageLimitMB: number;
  isLoaded: boolean;
  fetchStorage: () => Promise<void>;
};

export const useStorageStore = create<StorageState>((set, get) => ({
  storageUsedMB: 0,
  storageLimitMB: 1024,
  isLoaded: false,

  fetchStorage: async () => {
    // agar already fetch ho chuka hai is session mein, dobara call na karo
    if (get().isLoaded) return;

    try {
      const res = await api.get("/documents/dashboard/storage-usage");
      set({
        storageUsedMB: parseFloat(res.data.storageUsedMB) || 0,
        storageLimitMB: parseFloat(res.data.storageLimitMB) || 1024,
        isLoaded: true,
      });
    } catch (err) {
      console.error("Failed to load storage usage", err);
    }
  },
}));