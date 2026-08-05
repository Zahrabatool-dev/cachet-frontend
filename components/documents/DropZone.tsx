"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileCheck } from "lucide-react";

type DropZoneProps = {
  onFilesSelected: (files: File[]) => void;
};

export function DropZone({ onFilesSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesSelected(files);
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="relative cursor-pointer rounded-2xl overflow-hidden"
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        className="hidden"
      />

      <motion.div
  animate={{
    borderColor: isDragging
      ? "rgb(31, 77, 61)"       // tumhare globals.css ka --color-accent: 31 77 61
      : "rgba(31, 77, 61, 0.25)",
    scale: isDragging ? 1.01 : 1,
  }}
        transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        className="relative border-2 border-dashed rounded-2xl px-6 py-14 text-center bg-white/50 backdrop-blur-sm overflow-hidden"
      >
        {/* ambient glow that blooms while dragging */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgb(var(--color-accent) / 0.08), transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* faint dot grid inside the zone */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(var(--color-accent) / 0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative">
          <motion.div
            animate={{
              y: isDragging ? -4 : 0,
              scale: isDragging ? 1.1 : 1,
            }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-[rgb(var(--color-accent))]/10"
          >
            <AnimatePresence mode="wait">
              {isDragging ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <FileCheck size={24} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <UploadCloud size={24} className="text-[rgb(var(--color-accent))]" strokeWidth={1.75} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <h3 className="mt-4 font-display text-base font-medium text-[rgb(var(--color-text))]">
            {isDragging ? "Drop to upload" : "Drag & drop your files here"}
          </h3>
          <p className="mt-1.5 text-sm text-[rgb(var(--color-text-muted))]">
            or <span className="text-[rgb(var(--color-accent))] font-medium">browse</span> from your device
          </p>
          <p className="mt-3 text-xs text-[rgb(var(--color-text-muted))] font-mono">
            PDF, JPG, PNG · Max 20MB per file
          </p>
        </div>
      </motion.div>
    </div>
  );
}