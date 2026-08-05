"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/utils/fileHelpers";

export type SortOption = "uploadDate" | "expiryDate" | "title";
export type SortOrder = "asc" | "desc";

export type FilterState = {
  search: string;
  category: Category | "All";
  sortBy: SortOption;
  order: SortOrder;
};

type FilterBarProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
};

const sortLabels: Record<SortOption, string> = {
  uploadDate: "Upload date",
  expiryDate: "Expiry date",
  title: "Title",
};

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // debounce: search input change ke 300ms baad hi parent ko update bhejo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onChange({ ...filters, search: searchInput });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // outside click se dropdowns close karo
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasActiveFilters = filters.category !== "All" || filters.search !== "";

  const clearAll = () => {
    setSearchInput("");
    onChange({ search: "", category: "All", sortBy: "uploadDate", order: "desc" });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]"
        />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by document name..."
          className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/15 bg-white/70 backdrop-blur-sm text-sm outline-none focus:border-[rgb(var(--color-accent))]/40 transition-colors"
        />
        <AnimatePresence>
          {searchInput && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Category filter dropdown */}
      <div className="relative shrink-0" ref={categoryRef}>
        <button
          onClick={() => setCategoryOpen((v) => !v)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm transition-colors ${
            filters.category !== "All"
              ? "border-[rgb(var(--color-accent))]/50 bg-[rgb(var(--color-accent))]/8 text-[rgb(var(--color-accent))]"
              : "border-[rgb(var(--color-accent))]/15 bg-white/70 text-[rgb(var(--color-text-muted))]"
          }`}
        >
          <SlidersHorizontal size={14} />
          {filters.category === "All" ? "Category" : filters.category}
        </button>

        <AnimatePresence>
          {categoryOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 sm:left-0 mt-2 w-44 vault-panel-static py-1.5 z-30"
            >
              {(["All", ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onChange({ ...filters, category: cat });
                    setCategoryOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 hover:text-[rgb(var(--color-text))] transition-colors"
                >
                  {cat}
                  {filters.category === cat && (
                    <Check size={14} className="text-[rgb(var(--color-accent))]" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sort dropdown */}
      <div className="relative shrink-0" ref={sortRef}>
        <button
          onClick={() => setSortOpen((v) => !v)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[rgb(var(--color-accent))]/15 bg-white/70 text-sm text-[rgb(var(--color-text-muted))] hover:border-[rgb(var(--color-accent))]/30 transition-colors"
        >
          <ArrowUpDown size={14} />
          {sortLabels[filters.sortBy]}
        </button>

        <AnimatePresence>
          {sortOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 vault-panel-static py-1.5 z-30"
            >
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    onChange({ ...filters, sortBy: key });
                    setSortOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 hover:text-[rgb(var(--color-text))] transition-colors"
                >
                  {sortLabels[key]}
                  {filters.sortBy === key && (
                    <Check size={14} className="text-[rgb(var(--color-accent))]" />
                  )}
                </button>
              ))}

              <div className="h-px bg-[rgb(var(--color-accent))]/10 my-1.5" />

              <button
                onClick={() =>
                  onChange({ ...filters, order: filters.order === "asc" ? "desc" : "asc" })
                }
                className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-accent))]/6 hover:text-[rgb(var(--color-text))] transition-colors"
              >
                {filters.order === "asc" ? "Ascending" : "Descending"}
                <ArrowUpDown size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            onClick={clearAll}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-sm text-[rgb(var(--color-text-muted))] hover:text-red-500 transition-colors whitespace-nowrap overflow-hidden"
          >
            <X size={14} />
            Clear
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}