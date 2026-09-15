import { ROW_ACTION_PRESETS } from "./presets";
import type {
  ResolvedRowAction,
  RowAction,
  RowActionFlag,
  RowActionsList,
} from "./types";

function evalFlag<TRow>(
  flag: RowActionFlag<TRow> | undefined,
  data: TRow | undefined,
): boolean {
  if (typeof flag === "function") return Boolean(flag(data));
  return Boolean(flag);
}

export function resolveActions<TRow>(
  actions: RowActionsList<TRow>,
  data: TRow | undefined,
  hasPermission?: (permission: string) => boolean,
): ResolvedRowAction<TRow>[] {
  const list = typeof actions === "function" ? actions(data) : actions;

  return list.flatMap((action: RowAction<TRow>, index) => {
    const preset = action.preset ? ROW_ACTION_PRESETS[action.preset] : undefined;
    const key = action.key ?? action.preset ?? `action-${index}`;
    const label = action.label ?? preset?.label ?? key;

    if (action.permission && hasPermission && !hasPermission(action.permission)) {
      return [];
    }

    if (evalFlag(action.hidden, data)) {
      return [];
    }

    const tooltip =
      action.tooltip === false ? undefined : (action.tooltip ?? label);

    const resolved: ResolvedRowAction<TRow> = {
      key,
      label,
      icon: action.icon ?? preset?.icon,
      onClick: action.onClick,
      disabled: evalFlag(action.disabled, data),
      danger: action.danger ?? preset?.danger ?? false,
      highlight: evalFlag(action.highlight, data),
      tooltip,
      confirm: action.confirm,
      closeOnClick: action.closeOnClick !== false,
    };

    return [resolved];
  });
}
