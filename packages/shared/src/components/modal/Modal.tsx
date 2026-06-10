import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { FaFileExport, FaPrint } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { cn } from "../../utils/cn";
import type { ModalProps } from "./types";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "w-2/3",
  width,
  onPrint,
  onExport,
  modalBodyClassName,
  modalBodyWrapperClass,
  closeOnBackdropClick = false,
  closeOnEscape = true,
  zIndex = 1000,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEscape]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center p-4"
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: "1rem",
            zIndex,
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "bg-white rounded-3xl shadow-lg max-h-[90vh] flex flex-col mx-auto",
              className,
              width
            )}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "95vw",
              maxHeight: "90vh",
            }}
          >
            <div className="sticky top-0 z-10 flex justify-between items-center bg-white text-2xl p-8 pb-4 rounded-t-3xl">
              <h2 className="font-semibold">{title}</h2>
              <div className="flex items-center space-x-4">
                {onPrint && (
                  <button
                    type="button"
                    onClick={onPrint}
                    className="flex items-center gap-1 hover:text-gray-300 text-sm border p-1 rounded"
                  >
                    <FaPrint />
                    <span>Print</span>
                  </button>
                )}
                {onExport && (
                  <button
                    type="button"
                    onClick={onExport}
                    className="flex items-center gap-1 hover:text-gray-300 text-sm border p-1 rounded"
                  >
                    <FaFileExport />
                    <span>Export</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-2 hover:opacity-70 transition-opacity"
                >
                  <IoCloseCircleOutline color="#8898AA" size={25} />
                </button>
              </div>
            </div>

            <div
              className={cn(
                "overflow-y-auto px-8 pb-8 flex-grow scroll",
                modalBodyWrapperClass,
                modalBodyClassName
              )}
            >
              {children}
            </div>

            {footer && (
              <div className="sticky bottom-0 flex justify-end p-4 space-x-4 border-t bg-white rounded-b-3xl">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  let modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    document.body.appendChild(modalRoot);
  }

  return createPortal(modalContent, modalRoot);
}
