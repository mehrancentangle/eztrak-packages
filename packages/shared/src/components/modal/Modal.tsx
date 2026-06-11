import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { FaFileExport, FaPrint } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { cn } from "../../utils/cn";
import { Loader } from "../Loader";
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
  isLoading = false,
  customLoader = null

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
        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-1000 p-4"
        onClick={handleBackdropClick}
        style={{
          // Ensure it covers the entire viewport, even in micro frontend context
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: '1rem',
          zIndex: zIndex,
        }}
      >
        <motion.div
          ref={modalRef}
          initial={{ y: "-100vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100vh", opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            `bg-white rounded-3xl shadow-lg max-h-[90vh] flex flex-col mx-auto`,
            className,
            width
          )}
          onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking modal content
          style={{
            maxWidth: '95vw', // Ensure modal doesn't exceed viewport width
            maxHeight: '90vh', // Ensure modal doesn't exceed viewport height
          }}
        >
          {/* Modal Header */}
          <div
          style={{
            zIndex: 1000,
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            fontSize: '24px',
            fontWeight: 'semibold',
            padding: '8px 16px',
            borderRadius: '16px',
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
            margin: '0 16px',
            justifyContent: 'space-between',
          }}
          // className="sticky top-0 z-10 flex justify-between items-center bg-white text-2xl p-8 pb-4 rounded-t-3xl"
          >
            <h2 className="font-semibold">{title}</h2>
            <div className="flex items-center space-x-4">
              {onPrint && (
                <button
                  onClick={onPrint}
                  className="flex items-center gap-1 hover:text-gray-300 text-sm border p-1 rounded"
                >
                  <FaPrint name="FaPrint" />
                  <span>Print</span>
                </button>
              )}
              {onExport && (
                <button
                  onClick={onExport}
                  className="flex items-center gap-1 hover:text-gray-300 text-sm border p-1 rounded"
                >
                 <FaFileExport/>
                  <span>Export</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-2 hover:opacity-70 transition-opacity"
              >
                <IoCloseCircleOutline color="#8898AA" size={25} />
              </button>
            </div>
          </div>
          <div
            className={cn(
              "overflow-y-auto px-8 pb-8 grow scroll scrollbar-hidden",
              modalBodyWrapperClass
            )}
          >
            {children}
          </div>

          {/* Modal Footer */}
          {footer && (
            <div 
            style={{
              zIndex: 1000,
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              fontSize: '24px',
              fontWeight: 'semibold',
              padding: '8px 16px',
              borderRadius: '16px',
              boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
              margin: '0 16px',
              justifyContent: 'space-between',
            }}

            >
              {footer}
            </div>
          )}
        </motion.div>
        {isLoading && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-200/60"
            style={{ zIndex: 1100 }}
            aria-busy="true"
            aria-live="polite"
            role="status"
            onClick={(e) => e.stopPropagation()}
          >
            {customLoader ? customLoader : <Loader size="48px" />}
          </div>
        )}
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
