import type { CSSProperties } from "react";
import {
  FaArchive,
  FaCheckCircle,
  FaDownload,
  FaEdit,
  FaEye,
  FaFileAlt,
  FaHistory,
  FaTrashAlt,
} from "react-icons/fa";
import type { RowActionPreset, RowActionPresetName } from "./types";

/** Settings-app hover: peach bg `#FFF1EB` + orange text (`primary-50` / `primary-150`). */
export const ROW_ACTION_ITEM_HOVER_CLASS =
  "hover:bg-primary-50 hover:text-primary-150";

/** Settings/Department rest color (`#6C757D`). */
export const ROW_ACTION_ITEM_TEXT_CLASS = "text-secondary";

export const ROW_ACTION_DEFAULT_ICON_SIZE = 16;

export const ROW_ACTION_DEFAULT_MENU_TOOLTIP_STYLE: CSSProperties = {
  zIndex: 10000,
};

export const ROW_ACTION_PRESETS: Record<RowActionPresetName, RowActionPreset> = {
  edit: { label: "Edit", icon: FaEdit },
  delete: { label: "Delete", icon: FaTrashAlt, danger: true, iconClassName: "text-red-500" },
  view: { label: "View", icon: FaEye },
  notes: { label: "Notes", icon: FaFileAlt },
  history: { label: "History", icon: FaHistory },
  download: { label: "Download", icon: FaDownload },
  archive: { label: "Archive", icon: FaArchive },
  resolve: { label: "Resolve", icon: FaCheckCircle },
};
