import type { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  width?: string;
  onPrint?: () => void;
  onExport?: () => void;
  modalBodyClassName?: string;
  modalBodyWrapperClass?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  zIndex?: number;
  isLoading?: boolean;
  customLoader?: ReactNode;
}
