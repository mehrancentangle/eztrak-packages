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

export const ROW_ACTION_PRESETS: Record<RowActionPresetName, RowActionPreset> = {
  edit: { label: "Edit", icon: FaEdit },
  delete: { label: "Delete", icon: FaTrashAlt, danger: true },
  view: { label: "View", icon: FaEye },
  notes: { label: "Notes", icon: FaFileAlt },
  history: { label: "History", icon: FaHistory },
  download: { label: "Download", icon: FaDownload },
  archive: { label: "Archive", icon: FaArchive },
  resolve: { label: "Resolve", icon: FaCheckCircle },
};
