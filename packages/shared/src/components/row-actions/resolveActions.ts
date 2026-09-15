import { ROW_ACTION_PRESETS } from "./presets";
import type {
  ResolvedRowAction,
  RowAction,
  RowActionFlag,
  RowActionPreset,
  RowActionPresetName,
  RowActionsList,
} from "./types";

function evalFlag<TRow>(
  flag: RowActionFlag<TRow> | undefined,
  data: TRow | undefined,
): boolean {
  if (typeof flag === "function") return Boolean(flag(data));
  return Boolean(flag);
}

function mergePreset(
  name: RowActionPresetName | undefined,
  overrides?: Partial<Record<RowActionPresetName, Partial<RowActionPreset>>>,
): RowActionPreset | undefined {
  if (!name) return undefined;
  const base = ROW_ACTION_PRESETS[name];
  const extra = overrides?.[name];
  if (!extra) return base;
  return { ...base, ...extra };
}

export function resolveActions<TRow>(
  actions: RowActionsList<TRow>,
  data: TRow | undefined,
  hasPermission?: (permission: string) => boolean,
  presets?: Partial<Record<RowActionPresetName, Partial<RowActionPreset>>>,
): ResolvedRowAction<TRow>[] {
  const list = typeof actions === "function" ? actions(data) : actions;

  return list.flatMap((action: RowAction<TRow>, index) => {
    const type = action.type ?? "item";
    const preset = mergePreset(action.preset, presets);
    const key = action.key ?? action.preset ?? `action-${index}`;
    const label = action.label ?? preset?.label ?? key;

    if (action.permission && hasPermission && !hasPermission(action.permission)) {
      return [];
    }

    if (evalFlag(action.hidden, data)) {
      return [];
    }

    const tooltip =
      action.tooltip === false
        ? undefined
        : (action.tooltip ?? (type === "divider" ? undefined : label));

    const resolved: ResolvedRowAction<TRow> = {
      key,
      type,
      label,
      icon: action.icon ?? preset?.icon,
      iconSize: action.iconSize,
      content: action.content,
      onClick: action.onClick,
      disabled: evalFlag(action.disabled, data),
      danger: action.danger ?? preset?.danger ?? false,
      highlight: evalFlag(action.highlight, data),
      tooltip,
      tooltipPlacement: action.tooltipPlacement,
      confirm: action.confirm,
      closeOnClick: action.closeOnClick !== false,
      className: action.className,
    };

    return [resolved];
  });
}
