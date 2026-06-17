export const USER_STATE_STORAGE_KEY = "authState";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function getItem<T>(key: string, fallback: T | null = null): T | null {
  try {
    const raw = getStorage()?.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    getStorage()?.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write errors (quota exceeded, private mode, etc.)
  }
}

export function removeItem(key: string): void {
  try {
    getStorage()?.removeItem(key);
  } catch {
    // Ignore remove errors
  }
}

export function loadUserState<T = unknown>(
  key: string = USER_STATE_STORAGE_KEY
): T | undefined {
  const value = getItem<T | undefined>(key, undefined);
  return value === null ? undefined : value;
}

export function saveUserState<T = unknown>(
  state: T,
  key: string = USER_STATE_STORAGE_KEY
): void {
  setItem(key, state);
}

/** Task-aligned aliases */
export const get = getItem;
export const set = setItem;

/** Backward-compatible aliases used in federation apps */
export const getItemFromLocalStorage = getItem;
export const storeItemInLocalStorage = setItem;
export const saveItemLocalStorage = setItem;
