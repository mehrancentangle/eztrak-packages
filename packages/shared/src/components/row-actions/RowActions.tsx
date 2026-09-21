import type { ReactNode } from "react";
import { ToolTip } from "../tooltip/ToolTip";
import { PopupCellRenderer } from "../popup-cell-renderer/PopupCellRenderer";
import { confirmationAlert } from "../../utils/handleApiError";
import { cn } from "../../utils/cn";
import { ActionMenuItem } from "./ActionMenuItem";
import {
  ROW_ACTION_DEFAULT_ICON_SIZE,
  ROW_ACTION_DEFAULT_MENU_TOOLTIP_STYLE,
} from "./presets";
import { resolveActions } from "./resolveActions";
import type { ResolvedRowAction, RowActionsProps } from "./types";

function runAction<TRow>(
  action: ResolvedRowAction<TRow>,
  data: TRow | undefined,
  hide?: () => void,
  confirmFn: RowActionsProps<TRow>["confirmFn"] = confirmationAlert,
) {
  if (!action.onClick) {
    if (action.closeOnClick) hide?.();
    return;
  }

  const execute = () => action.onClick?.(data);

  if (action.confirm) {
    confirmFn?.(execute, action.confirm);
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
  itemClassName,
  itemIconClassName,
  itemLabelClassName,
  iconSize = ROW_ACTION_DEFAULT_ICON_SIZE,
  triggerTooltip = "Actions",
  triggerAriaLabel = "Row actions",
  hasPermission,
  placement = "bottom-end",
  openOnHover = false,
  tippyProps,
  presets,
  confirmFn = confirmationAlert,
  tooltipPlacement = "top",
  tooltipDelayShow,
  tooltipDelayHide,
  tooltipClassName,
  tooltipStyle,
  renderItem,
  renderMenu,
  renderTrigger,
}: RowActionsProps<TRow>) {
  const resolved = resolveActions(actions, data, hasPermission, presets);

  if (resolved.length === 0) {
    return null;
  }

  const mergedTooltipStyle = {
    ...ROW_ACTION_DEFAULT_MENU_TOOLTIP_STYLE,
    ...tooltipStyle,
  };

  const renderDefaultItem = (
    action: ResolvedRowAction<TRow>,
    hide?: () => void,
    showLabel = true,
  ): ReactNode => {
    if (action.type === "divider") {
      return (
        <div
          key={action.key}
          role="separator"
          className={cn("my-1 h-px bg-gray-100", action.className)}
        />
      );
    }

    if (action.content) {
      return (
        <div key={action.key} className={action.className}>
          {action.content}
        </div>
      );
    }

    return (
      <ActionMenuItem
        key={action.key}
        label={action.label}
        icon={action.icon}
        iconSize={action.iconSize ?? iconSize}
        iconClassName={cn(itemIconClassName, action.iconClassName)}
        labelClassName={cn(itemLabelClassName, action.labelClassName)}
        tooltip={action.tooltip}
        tooltipPlacement={action.tooltipPlacement ?? tooltipPlacement}
        tooltipDelayShow={tooltipDelayShow}
        tooltipDelayHide={tooltipDelayHide}
        tooltipClassName={tooltipClassName}
        tooltipStyle={mergedTooltipStyle}
        disabled={action.disabled}
        danger={action.danger}
        highlight={action.highlight}
        showLabel={showLabel}
        className={cn(itemClassName, action.className)}
        onClick={() => runAction(action, data, hide, confirmFn)}
      />
    );
  };

  const renderItems = (hide?: () => void, showLabel = true): ReactNode =>
    resolved.map((action) => {
      const defaultItem = renderDefaultItem(action, hide, showLabel);
      if (!renderItem) return defaultItem;
      return (
        <div key={action.key}>
          {renderItem(action, { data, hide: hide ?? (() => undefined), defaultItem })}
        </div>
      );
    });

  if (mode === "inline") {
    const inlineItems = renderItems(undefined, false);
    return (
      <div className={cn("flex h-full items-center justify-center gap-1", className)}>
        {inlineItems}
      </div>
    );
  }

  const triggerTooltipText =
    triggerTooltip === false ? undefined : triggerTooltip;

  const buildMenu = (hide: () => void): ReactNode => {
    const defaultMenu = (
      <div
        className={cn(
          "flex min-w-[180px] flex-col rounded-lg border border-gray-100 bg-white p-2 shadow-lg",
          menuClassName,
        )}
      >
        {renderItems(hide, true)}
      </div>
    );

    if (!renderMenu) return defaultMenu;
    return renderMenu({
      data,
      actions: resolved,
      hide,
      defaultMenu,
    });
  };

  if (renderTrigger) {
    return (
      <>
        {renderTrigger({
          data,
          actions: resolved,
          hide: () => undefined,
          defaultMenu: buildMenu(() => undefined),
        })}
      </>
    );
  }

  return (
    <ToolTip
      text={triggerTooltipText}
      disabled={!triggerTooltipText}
      placement={tooltipPlacement}
      delayShow={tooltipDelayShow}
      delayHide={tooltipDelayHide}
      tooltipClassName={tooltipClassName}
      tooltipStyle={tooltipStyle}
      className="flex h-full items-center justify-center"
    >
      <PopupCellRenderer
        params={{ data }}
        actionIcon={actionIcon}
        hideTitle
        className={className}
        placement={placement}
        openOnHover={openOnHover}
        tippyProps={tippyProps}
        ariaLabel={triggerAriaLabel}
        dropDownContent={(handleAction) =>
          buildMenu(() => handleAction("close"))
        }
      />
    </ToolTip>
  );
}
