"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { LayoutGrid, List, FolderOpen, CheckSquare, X as XIcon, Trash2 as Trash2Icon, FolderInput, FileArchive } from "lucide-react";
import { DropZone } from "@/components/documents/DropZone";
import { UploadQueue, type QueuedFile } from "@/components/documents/UploadQueue";
import { CategoryModal } from "@/components/documents/CategoryModal";
import { ZipUploadModal } from "@/components/documents/ZipUploadModal";
import { ShareModal } from "@/components/documents/ShareModal";
import { RenameModal } from "@/components/documents/RenameModal";
import { DocumentCard, type Document } from "@/components/documents/DocumentCard";
import { FilterBar, type FilterState } from "@/components/documents/FilterBar";
import { type Category, CATEGORIES } from "@/lib/utils/fileHelpers";
import api from "@/lib/api";
import { useStorageStore } from "@/lib/storageStore";

type UploadMetadata = { category: Category; tags: string[]; expiryDate: string | null };

export default function DocumentsPage() {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [itemMetadata, setItemMetadata] = useState<Record<string, UploadMetadata>>({});
  const [view, setView] = useState<"grid" | "list">("grid");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareTarget, setShareTarget] = useState<Document | null>(null);
  const [renameTarget, setRenameTarget] = useState<Document | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zipModalOpen, setZipModalOpen] = useState(false);
 const [filters, setFiltersState] = useState<FilterState>({
  search: "",
  category: "All",
  sortBy: "uploadDate",
  order: "desc",
});

// mount pe localStorage se load karo
useEffect(() => {
  const saved = localStorage.getItem("cachet-doc-filters");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // search kabhi persist nahi karte, sirf sort/category
      setFiltersState((prev) => ({ ...prev, category: parsed.category, sortBy: parsed.sortBy, order: parsed.order }));
    } catch {}
  }
}, []);

// wrapper jo filters change hone pe localStorage bhi update kare
const setFilters = (newFilters: FilterState) => {
  setFiltersState(newFilters);
  localStorage.setItem(
    "cachet-doc-filters",
    JSON.stringify({ category: newFilters.category, sortBy: newFilters.sortBy, order: newFilters.order })
  );
};
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {
        sortBy: filters.sortBy,
        order: filters.order,
      };
      if (filters.search) params.search = filters.search;
      if (filters.category !== "All") params.category = filters.category.toLowerCase();

      const res = await api.get("/documents", { params });
      setDocuments(res.data.documents || res.data);
    } catch (err) {
      toast.error("Couldn't load your documents");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFilesSelected = (files: File[]) => {
    setPendingFiles(files);
    setModalOpen(true);
  };

  const uploadFile = async (item: QueuedFile, metadata: UploadMetadata) => {
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("title", item.file.name);
    formData.append("category", metadata.category.toLowerCase());
    formData.append("tags", metadata.tags.join(","));
    if (metadata.expiryDate) formData.append("expiryDate", metadata.expiryDate);

    try {
      await api.post("/documents/upload", formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          setQueue((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, progress: percent } : f))
          );
        },
      });
      setQueue((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, progress: 100, status: "success" } : f))
      );
      toast.success(`${item.file.name} uploaded successfully`);
      fetchDocuments();

      useStorageStore.setState({ isLoaded: false });
      useStorageStore.getState().fetchStorage();
    } catch (err: any) {
      let message = "Upload failed";

      if (err?.response?.data?.message) {
        // backend ne wajah bataayi (file type, size, auth, etc.)
        message = err.response.data.message;
      } else if (err?.code === "ECONNABORTED") {
        message = "Upload timed out - try a smaller file or better connection";
      } else if (!err?.response) {
        // request backend tak pohanchi hi nahi — network/browser level issue
        message = "Couldn't read this file - try picking it from your gallery instead of Drive";
      }

      setQueue((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "error", errorMessage: message } : f))
      );
      toast.error(message);
    }
  };

  const handleConfirmUpload = (metadataList: UploadMetadata[]) => {
    setModalOpen(false);

    const newQueue: QueuedFile[] = pendingFiles.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      progress: 0,
      status: "uploading",
    }));

    // metadata ko id ke against save karo taake retry pe use ho sake
    const newMetadata: Record<string, UploadMetadata> = {};
    newQueue.forEach((item, idx) => {
      newMetadata[item.id] = metadataList[idx];
    });
    setItemMetadata((prev) => ({ ...prev, ...newMetadata }));

    setQueue((prev) => [...newQueue, ...prev]);
    newQueue.forEach((item, idx) => uploadFile(item, metadataList[idx]));
    setPendingFiles([]);
  };

  const removeFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((f) => f.id !== id));
    setItemMetadata((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const retryUpload = (id: string) => {
    const item = queue.find((f) => f.id === id);
    const metadata = itemMetadata[id];
    if (!item || !metadata) {
      toast.error("Couldn't retry — please re-upload this file");
      return;
    }

    setQueue((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "uploading", progress: 0, errorMessage: undefined } : f
      )
    );
    uploadFile(item, metadata);
  };

  const handleDelete = async (id: string) => {
    const prevDocs = documents;
    setDocuments((prev) => prev.filter((d) => d._id !== id));
    try {
      await api.delete(`/documents/${id}`);
      toast.success("Document deleted");
      useStorageStore.setState({ isLoaded: false });
      useStorageStore.getState().fetchStorage();
    } catch (err) {
      setDocuments(prevDocs);
      toast.error("Couldn't delete document");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} document(s)? This can't be undone.`)) return;
    const prevDocs = documents;
    setDocuments((prev) => prev.filter((d) => !selectedIds.includes(d._id)));
    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/documents/${id}`)));
      toast.success(`${selectedIds.length} document(s) deleted`);
      useStorageStore.setState({ isLoaded: false });
      useStorageStore.getState().fetchStorage();
    } catch (err) {
      setDocuments(prevDocs);
      toast.error("Some documents couldn't be deleted");
    } finally {
      exitSelectionMode();
    }
  };

  const handleBulkCategoryChange = async (newCategory: string) => {
    try {
      await Promise.all(
        selectedIds.map((id) => api.put(`/documents/${id}`, { category: newCategory.toLowerCase() }))
      );
      toast.success(`Moved ${selectedIds.length} document(s) to ${newCategory}`);
      fetchDocuments();
    } catch (err) {
      toast.error("Some documents couldn't be updated");
    } finally {
      exitSelectionMode();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-[rgb(var(--color-text))]">
            My Documents
          </h1>
          <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
            Upload, organize, and manage your sealed documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZipModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[rgb(var(--color-accent))]/8 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/15 transition-colors"
          >
            <FileArchive size={14} /> Import ZIP
          </button>

          <button
            onClick={() => (selectionMode ? exitSelectionMode() : setSelectionMode(true))}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectionMode ? "bg-[rgb(var(--color-accent))] text-white" : "bg-[rgb(var(--color-accent))]/8 text-[rgb(var(--color-text-muted))]"
            }`}
          >
            <CheckSquare size={14} /> Select
          </button>

          <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-[rgb(var(--color-accent))]/6">
            <button
              onClick={() => setView("grid")}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                view === "grid" ? "bg-white text-[rgb(var(--color-accent))] shadow-sm" : "text-[rgb(var(--color-text-muted))]"
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                view === "list" ? "bg-white text-[rgb(var(--color-accent))] shadow-sm" : "text-[rgb(var(--color-text-muted))]"
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <DropZone onFilesSelected={handleFilesSelected} />
        <UploadQueue files={queue} onRemove={removeFromQueue} onRetry={retryUpload} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-6">
        <FilterBar filters={filters} onChange={setFilters} />
      </motion.div>

      <div className="mt-8">
        {isLoading ? (
          <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-2.5"}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="vault-panel-static h-28 animate-pulse" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-[rgb(var(--color-accent))]/10">
              <FolderOpen size={20} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 font-display text-base font-medium text-[rgb(var(--color-text))]">
              No documents yet
            </h3>
            <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
              Drag a file above or click to browse and upload your first document.
            </p>
          </motion.div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  doc={doc}
                  view="grid"
                  onDelete={handleDelete}
                  onShare={(d) => setShareTarget(d)}
                  onRename={(d) => setRenameTarget(d)}
                  selectionMode={selectionMode}
                  selected={selectedIds.includes(doc._id)}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="vault-panel-static overflow-x-auto p-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[rgb(var(--color-accent))]/10">
                  <th className="py-3 pl-4 pr-3 text-left text-xs font-medium text-[rgb(var(--color-text-muted))] uppercase tracking-wide">
                    Name
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-medium text-[rgb(var(--color-text-muted))] uppercase tracking-wide">
                    Category
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-medium text-[rgb(var(--color-text-muted))] uppercase tracking-wide">
                    Size
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-medium text-[rgb(var(--color-text-muted))] uppercase tracking-wide">
                    Expiry
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-medium text-[rgb(var(--color-text-muted))] uppercase tracking-wide hidden lg:table-cell">
                    Uploaded
                  </th>
                  <th className="py-3 pr-4 pl-3" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {documents.map((doc) => (
                    <DocumentCard
                      key={doc._id}
                      doc={doc}
                      view="list"
                      onDelete={handleDelete}
                      onShare={(d) => setShareTarget(d)}
                      onRename={(d) => setRenameTarget(d)}
                      selectionMode={selectionMode}
                      selected={selectedIds.includes(doc._id)}
                      onToggleSelect={toggleSelect}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectionMode && selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 vault-panel px-4 sm:px-5 py-3 flex flex-wrap items-center gap-3 sm:gap-4 justify-center"
          >
            <span className="text-sm font-medium text-[rgb(var(--color-text))]">
              {selectedIds.length} selected
            </span>
            <div className="h-4 w-px bg-[rgb(var(--color-accent))]/20" />
            <select
              onChange={(e) => e.target.value && handleBulkCategoryChange(e.target.value)}
              defaultValue=""
              className="text-sm bg-transparent outline-none text-[rgb(var(--color-text-muted))]"
            >
              <option value="" disabled>Move to...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={handleBulkDelete} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600">
              <Trash2Icon size={14} /> Delete
            </button>
            <button onClick={exitSelectionMode} className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]">
              <XIcon size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CategoryModal
        files={pendingFiles}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPendingFiles([]);
        }}
        onConfirm={handleConfirmUpload}
      />

      <ZipUploadModal
        open={zipModalOpen}
        onClose={() => setZipModalOpen(false)}
        onImported={fetchDocuments}
      />

      {shareTarget && (
        <ShareModal
          documentId={shareTarget._id}
          documentTitle={shareTarget.title}
          open={!!shareTarget}
          onClose={() => setShareTarget(null)}
        />
      )}

      {renameTarget && (
        <RenameModal
          documentId={renameTarget._id}
          currentTitle={renameTarget.title}
          open={!!renameTarget}
          onClose={() => setRenameTarget(null)}
          onRenamed={(newTitle) => {
            setDocuments((prev) => prev.map((d) => (d._id === renameTarget._id ? { ...d, title: newTitle } : d)));
          }}
        />
      )}
    </div>
  );
}