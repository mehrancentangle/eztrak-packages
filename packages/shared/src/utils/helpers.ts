export const truncateText = (text: string | null | undefined, maxLength = 20) => {
  if (!text) return "";
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + "...";
};

export function getApiError(apiError: unknown): string {
  if (!apiError) return "An unknown error occurred";

  if (typeof apiError === "string") {
    return apiError;
  }

  const error = apiError as {
    response?: { data?: Record<string, unknown> };
    message?: string;
  };

  if (error.response?.data) {
    const responseData = error.response.data;

    if (typeof responseData === "string") {
      return responseData;
    }

    const errors = responseData.errors;
    if (errors && typeof errors === "object") {
      for (const key in errors) {
        const messages = (errors as Record<string, unknown>)[key];
        if (Array.isArray(messages) && messages.length > 0) {
          return String(messages[0]);
        }
      }
    }

    if (responseData.message) {
      return String(responseData.message);
    }

    if (responseData.title) {
      return String(responseData.title);
    }
  }

  if (error.message) {
    return error.message;
  }

  return "An unknown error occurred";
}

export const normalizeApiListItems = (responseData: unknown): unknown[] => {
  if (responseData == null) return [];
  if (Array.isArray(responseData)) return responseData;

  const record = responseData as Record<string, unknown>;
  const data = record.data;

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Array.isArray((data as { items?: unknown[] }).items)
  ) {
    return (data as { items: unknown[] }).items;
  }

  const returnModel = record.returnModel as { items?: unknown[] } | undefined;
  if (Array.isArray(returnModel?.items)) return returnModel.items;
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && data !== null) {
    return [data];
  }
  return [];
};

export function capitalizeText(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function toLowerCaseText(text: string | null | undefined): string {
  if (!text) return "";
  return text.toLowerCase();
}

export const formatDate = (dateString: string | null | undefined): string => {
  if (dateString === null || dateString === undefined) return "-";
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${month}/${day}/${year}`;
};

export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const toDateInputValue = (date: string | Date | null | undefined): string => {
  if (!date) return "";

  let d: Date;

  if (typeof date === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    d = new Date(date);
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return "";

  const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  const year = localDate.getFullYear();
  const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
  const day = localDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function convertCommaDataToArray(data: string | null | undefined): string[] {
  if (!data || data.trim() === "") {
    return [];
  }
  return data.split(",").map((item) => item.trim());
}

export function checkIfExistsInArray<T>(array: T[], searchValue: T): boolean {
  return array.includes(searchValue);
}

export const currencyFormatter = (value: number | null | undefined): string => {
  return value?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  }) ?? "";
};

export const parseCurrencyValueToNumber = (value: unknown): number => {
  if (value == null || value === "") return 0;

  const raw =
    typeof value === "object" && value !== null && "value" in value
      ? (value as { value: unknown }).value
      : value;

  const stringValue = raw == null || raw === "" ? "" : String(raw);
  const numericValue = stringValue.replace(/[$,]/g, "");
  return parseFloat(numericValue) || 0;
};

export function flattenTableData<T extends Record<string, unknown>>(
  data: T[] | null | undefined,
  columns: { field?: string }[] | null | undefined
): T[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const flatRow = { ...row };
    (columns ?? []).forEach((col) => {
      const key = col.field;
      if (!key) return;
      if (key.includes(".")) {
        const value = key.split(".").reduce<unknown>(
          (acc, part) => (acc as Record<string, unknown> | undefined)?.[part],
          row
        );
        (flatRow as Record<string, unknown>)[key] = value ?? "";
      }
    });
    return flatRow;
  });
}

export const getErrorMessages = (error: {
  data?: {
    errors?: Record<string, string[]>;
    title?: string;
    error?: { name?: string[] };
  };
} | null | undefined): string => {
  if (error?.data?.errors) {
    return Object.values(error.data.errors).flat().join("\n");
  }
  return (
    error?.data?.title ??
    error?.data?.error?.name?.[0] ??
    "Failed to save"
  );
};

export const getFieldsByCategory = <T extends { category?: string }>(
  fields: T[] = [],
  key: string
): T[] => {
  return fields?.filter(({ category = "" }) => category === key);
};

export const getFieldsByName = <T extends { name?: string }>(
  fields: T[] = [],
  key: string
): T[] => {
  return fields.filter(({ name = "" }) => name === key);
};

export const deserializeJson = <T = unknown>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "Invalid Date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

export const removeByPropertyValues = <T extends Record<string, unknown>>(
  items: T[] = [],
  property: keyof T & string,
  values: unknown[] = [],
  { caseInsensitive = false }: { caseInsensitive?: boolean } = {}
): T[] => {
  if (!Array.isArray(items) || !property) return Array.isArray(items) ? items : [];
  const normalize = (v: unknown) =>
    caseInsensitive && typeof v === "string" ? v.toLowerCase() : v;
  const valuesArr = Array.isArray(values) ? values : [values];
  const toRemove = new Set(valuesArr.map(normalize));
  return items.filter((item) => !toRemove.has(normalize(item?.[property])));
};

export const getFieldsByInputType = <T extends { inputType?: string }>(
  fields: T[] = [],
  key: string
): T[] => {
  return fields.filter(({ inputType = "" }) => inputType === key);
};
