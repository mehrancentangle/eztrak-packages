import { ToolTip } from "../tooltip/ToolTip";
import { PopupCellRenderer } from "../popup-cell-renderer/PopupCellRenderer";
import { confirmationAlert } from "../../utils/handleApiError";
import { cn } from "../../utils/cn";
import { ActionMenuItem } from "./ActionMenuItem";
import { resolveActions } from "./resolveActions";
import type { ResolvedRowAction, RowActionsProps } from "./types";

function runAction<TRow>(
  action: ResolvedRowAction<TRow>,
  data: TRow | undefined,
  hide?: () => void,
) {
  const execute = () => action.onClick(data);

  if (action.confirm) {
    confirmationAlert(execute, action.confirm);
  } else {
    execute();
  }

  if (action.closeOnClick) {
    hide?.();
  }
}

export function RowActions<TRow = unknown>({
  actions,
  data,
  mode = "menu",
  actionIcon,
  className,
  menuClassName,
  triggerTooltip = "Actions",
  hasPermission,
  placement = "bottom-end",
}: RowActionsProps<TRow>) {
  const resolved = resolveActions(actions, data, hasPermission);

  if (resolved.length === 0) {
    return null;
  }

  if (mode === "inline") {
    return (
      <div className={cn("flex h-full items-center justify-center gap-1", className)}>
        {resolved.map((action) => (
          <ActionMenuItem
            key={action.key}
            label={action.label}
            icon={action.icon}
            tooltip={action.tooltip}
            disabled={action.disabled}
            danger={action.danger}
            highlight={action.highlight}
            showLabel={false}
            onClick={() => runAction(action, data)}
          />
        ))}
      </div>
    );
  }

  const triggerTooltipText =
    triggerTooltip === false ? undefined : triggerTooltip;

  return (
    <ToolTip
      text={triggerTooltipText}
      disabled={!triggerTooltipText}
      className="flex h-full items-center justify-center"
    >
      <PopupCellRenderer
        params={{ data }}
        actionIcon={actionIcon}
        hideTitle
        className={className}
        placement={placement}
        dropDownContent={(handleAction) => (
          <div
            className={cn(
              "flex min-w-[180px] flex-col rounded-lg border border-gray-100 bg-white p-2 shadow-lg",
              menuClassName,
            )}
          >
            {resolved.map((action) => (
              <ActionMenuItem
                key={action.key}
                label={action.label}
                icon={action.icon}
                tooltip={action.tooltip}
                disabled={action.disabled}
                danger={action.danger}
                highlight={action.highlight}
                showLabel
                onClick={() =>
                  runAction(action, data, () => handleAction(action.key))
                }
              />
            ))}
          </div>
        )}
      />
    </ToolTip>
  );
}
