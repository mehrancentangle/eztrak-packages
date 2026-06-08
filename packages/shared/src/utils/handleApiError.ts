import toast from "react-hot-toast";
import Swal from "sweetalert2";

export type RtkQueryError = {
  status?: number | string;
  originalStatus?: number;
  data?: {
    errors?: Record<string, string[]>;
    message?: string;
    title?: string;
  };
  error?: string;
};

export interface HandleApiErrorOptions {
  showAlert?: boolean;
  fallbackMessage?: string;
}

export function formatValidationErrorsHtml(
  errors: Record<string, string[]>
): string {
  const items = Object.keys(errors).flatMap((field) =>
    (errors[field] || []).map((msg) => `<li>${msg}</li>`)
  );
  return `
        <div style="text-align:left">
          <p>Please review and correct the following:</p>
          <ul style="margin:8px 0 0 16px; list-style:disc;">
            ${items.join("")}
          </ul>
        </div>
      `;
}

function showValidationAlert(html: string): void {
  void Swal.fire({
    title: "Validation errors",
    html,
    icon: "error",
    confirmButtonText: "OK",
    showCancelButton: false,
    confirmButtonColor: "#FF7335",
  });
}

/** Handles RTK Query errors with built-in toast.error or SweetAlert (when showAlert is true). */
export function handleApiError(
  error: RtkQueryError | null | undefined,
  { showAlert = false, fallbackMessage }: HandleApiErrorOptions = {}
): void {
  if (!error) return;

  const status = error.status ?? error.originalStatus;
  const data = error.data;

  if (status === 200) {
    return;
  }

  if (data?.errors && typeof data.errors === "object") {
    const errors = data.errors;

    if (showAlert) {
      showValidationAlert(formatValidationErrorsHtml(errors));
    } else {
      Object.keys(errors).forEach((field) => {
        (errors[field] || []).forEach((errorMessage) => {
          toast.error(errorMessage);
        });
      });
    }
    return;
  }

  if (status === 404) {
    return;
  }

  const message =
    fallbackMessage ||
    data?.message ||
    data?.title ||
    error.error ||
    "An error occurred. Please try again.";

  toast.error(message);
}

export interface ConfirmationAlertOptions {
  title?: string;
  text?: string;
  icon?: "warning" | "info" | "question" | "error" | "success";
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function confirmationAlert(
  onConfirm: () => void,
  options: ConfirmationAlertOptions = {}
): void {
  void Swal.fire({
    title: options.title ?? "Are you sure?",
    text: options.text,
    icon: options.icon ?? "warning",
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText ?? "Yes",
    cancelButtonText: options.cancelButtonText ?? "Cancel",
    confirmButtonColor: "#FF7335",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
}
