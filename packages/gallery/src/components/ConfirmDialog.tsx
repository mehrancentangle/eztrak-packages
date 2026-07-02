import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { ConfirmDialogProps } from "../types";
import { cn } from "../utils/cn";

function getDialogRoot() {
  let root = document.getElementById("gallery-dialog-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "gallery-dialog-root";
    document.body.appendChild(root);
  }
  return root;
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Yes, delete it!",
  cancelText = "Cancel",
  zIndex = 1400,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    confirmRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 mb-6">{message}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium",
                  "border border-gray-300 text-gray-700 bg-white",
                  "hover:bg-gray-50 transition-colors",
                )}
              >
                {cancelText}
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium",
                  "bg-red-600 text-white",
                  "hover:bg-red-700 transition-colors",
                )}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    getDialogRoot(),
  );
}
