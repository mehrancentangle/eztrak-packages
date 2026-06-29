import toast from "react-hot-toast";
import Swal, { type SweetAlertOptions, type SweetAlertResult } from "sweetalert2";

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

const BRAND_ORANGE = "#FF7335";
const CANCEL_RED = "#ff0000";

export interface ConfirmationAlertOptions {
  title?: string;
  text?: string;
  html?: string;
  icon?: "warning" | "info" | "question" | "error" | "success";
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  showLoaderOnConfirm?: boolean;
  /** Type exactly — trimmed, case-sensitive. */
  inputExpectedValue?: string;
  inputPlaceholder?: string;
  reverseButtons?: boolean;
  focusCancel?: boolean;
  zIndex?: number;
}

function getConfirmErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const err = error as {
      message?: string;
      data?: { message?: string; title?: string };
    };
    return (
      err.data?.message ||
      err.data?.title ||
      err.message ||
      "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
}

export function confirmationAlert(
  onConfirm: () => void | Promise<void>,
  options: ConfirmationAlertOptions = {}
): void {
  const {
    title = options.inputExpectedValue ? "Confirmation Required" : "Are you sure?",
    text,
    html,
    icon = "warning",
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel",
    confirmButtonColor = BRAND_ORANGE,
    cancelButtonColor = CANCEL_RED,
    showLoaderOnConfirm = false,
    inputExpectedValue,
    inputPlaceholder = "Type confirmation text to proceed",
    reverseButtons,
    focusCancel,
    zIndex,
  } = options;

  const hasInput = Boolean(inputExpectedValue);
  const useLoader = showLoaderOnConfirm || hasInput;

  const inputHtml =
    html ??
    (hasInput
      ? `
      ${text ? `<p style="margin-bottom: 15px;">${text}</p>` : ""}
      <p style="margin-bottom: 10px; font-weight: bold; color: #666;">
        Please type "<span style="color: ${BRAND_ORANGE}; font-weight: bold;">${inputExpectedValue}</span>" to confirm:
      </p>
    `
      : undefined);

  const swalOptions: SweetAlertOptions = {
    title,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
    reverseButtons,
    focusCancel,
    allowOutsideClick: () => !Swal.isLoading(),
    allowEscapeKey: () => !Swal.isLoading(),
    didOpen: () => {
      if (zIndex == null) return;
      const container = Swal.getContainer();
      if (container) container.style.zIndex = String(zIndex);
    },
  };

  if (hasInput) {
    swalOptions.html = inputHtml;
    swalOptions.input = "text";
    swalOptions.inputPlaceholder = inputPlaceholder;
    swalOptions.inputValidator = (value: string) => {
      if (!value?.trim()) return "You need to enter the confirmation text!";
      if (value.trim() !== inputExpectedValue!.trim()) {
        return `Please type "${inputExpectedValue}" exactly as shown!`;
      }
      return null;
    };
  } else if (html) {
    swalOptions.html = html;
  } else {
    swalOptions.text = text;
  }

  if (useLoader) {
    swalOptions.showLoaderOnConfirm = true;
    swalOptions.preConfirm = (inputValue: string) => {
      if (hasInput && inputValue?.trim() !== inputExpectedValue!.trim()) {
        Swal.showValidationMessage(
          `Please type "${inputExpectedValue}" exactly as shown!`
        );
        return false;
      }
      return Promise.resolve()
        .then(() => onConfirm())
        .catch((error) => {
          Swal.showValidationMessage(getConfirmErrorMessage(error));
          throw error;
        });
    };
  }

  void Swal.fire(swalOptions).then((result: SweetAlertResult) => {
    if (result.isConfirmed && !useLoader) {
      void Promise.resolve(onConfirm());
    }
  });
}
