import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import { ToolTip } from "../tooltip/ToolTip";
import type { SidebarItem, SidebarProps } from "./types";

function getItemTooltip(item: SidebarItem) {
  return item.tooltip || item.name;
}

function getTooltipPlacement(item: SidebarItem, collapsed: boolean) {
  return item.tooltipPlacement || (collapsed ? "right" : "top");
}

function isItemActive(pathname: string, link?: string) {
  if (!link || link === "#") return false;
  return pathname === link || pathname.startsWith(`${link}/`);
}

function SidebarItemLabel({
  name,
  collapsed,
  className,
}: {
  name: string;
  collapsed: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        className,
        collapsed &&
          "block w-full text-center text-[10px] font-medium leading-tight line-clamp-2 wrap-break-word"
      )}
    >
      {name}
    </span>
  );
}

function SidebarItemIcon({
  icon,
  className,
}: {
  icon?: SidebarItem["icon"];
  className?: string;
}) {
  if (!icon) return null;
  return (
    <span className={cn("inline-flex shrink-0", className)} aria-hidden="true">
      {icon}
    </span>
  );
}

export function Sidebar({
  className,
  sideCollapseWidth = "w-24",
  sidebarWidth = "w-48",
  header,
  children,
  footer,
  items = [],
  logoUrl = "",
  logoRouteUrl = "",
  logoAltText = "Logo",
  collapseButtonText = "⬅️ Collapse",
  expandButtonText = "➡️",
  location: _location,
  classNames = {},
  onCollapseChange,
  isCollapsed = false,
  itemDropdownIcon = <span>▼</span>,
  ...rest
}: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(isCollapsed);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const onCollapseChangeRef = useRef(onCollapseChange);
  onCollapseChangeRef.current = onCollapseChange;

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  useEffect(() => {
    onCollapseChangeRef.current?.(collapsed);
  }, [collapsed]);

  const toggleGroup = (group: string) => {
    setOpenGroups((prevState) => ({
      ...prevState,
      [group]: !prevState[group],
    }));
  };

  const itemLayoutClass = (active: boolean, itemClassName?: string) =>
    cn(
      "flex cursor-pointer",
      classNames?.navItem,
      collapsed &&
        "w-full flex-col items-center justify-center gap-0.5 px-1 py-2 my-1 !mx-0 max-w-full min-w-0 box-border text-center min-h-11",
      active && "active",
      itemClassName
    );

  const renderLink = (item: SidebarItem, key: string) => {
    const active = isItemActive(location.pathname, item.link);

    return (
      <div key={key} className="max-w-full min-w-0" data-sidebar-item={item.name}>
        <ToolTip
          text={getItemTooltip(item)}
          placement={getTooltipPlacement(item, collapsed)}
          delayShow={150}
          className="block max-w-full min-w-0"
        >
          <Link
            to={item.link || "#"}
            className={itemLayoutClass(active, item.itemClassName)}
            aria-current={active ? "page" : undefined}
          >
            <SidebarItemIcon icon={item.icon} className={classNames?.navItemText} />
            <SidebarItemLabel
              name={item.name}
              collapsed={collapsed}
              className={classNames?.navItemText}
            />
          </Link>
        </ToolTip>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen overflow-hidden",
        collapsed ? `${sideCollapseWidth} items-stretch collapsed` : sidebarWidth,
        "transition-[width] duration-200 ease-in-out motion-reduce:transition-none",
        className
      )}
      {...rest}
    >
      {logoUrl && (
        <div
          className={cn(
            "flex items-center justify-center h-16 border-b border-gray-300",
            classNames.logoSection
          )}
        >
          {logoRouteUrl ? (
            <Link
              to={logoRouteUrl}
              className="sidebar-logo-link inline-flex items-center justify-center"
            >
              <img src={logoUrl} alt={logoAltText} className="h-10" />
            </Link>
          ) : (
            <img src={logoUrl} alt={logoAltText} className="h-10" />
          )}
        </div>
      )}

      {header && (
        <div className="flex items-center justify-between p-4 border-b border-gray-300 shrink-0">
          {header}
        </div>
      )}

      <nav
        aria-label="Sidebar"
        className={cn(
          "grow min-h-0 min-w-0 w-full",
          classNames.navSection
        )}
      >
        {items.map((item, index) => {
          if (item.subItems) {
            const groupOpen = Boolean(openGroups[item.name]);
            const groupId = `sidebar-group-${index}`;

            return (
              <div
                key={index}
                className={cn(
                  "has-sub-items max-w-full min-w-0 flex flex-col",
                  collapsed ? "my-1" : "my-2"
                )}
              >
                <ToolTip
                  text={getItemTooltip(item)}
                  placement={getTooltipPlacement(item, collapsed)}
                  delayShow={150}
                  className="flex flex-col w-full max-w-full min-w-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.name)}
                    data-sidebar-item={item.name}
                    aria-expanded={groupOpen}
                    aria-controls={groupId}
                    className={cn(
                      itemLayoutClass(false, item.itemClassName),
                      !collapsed && "dropdown-title-wrapper",
                      "relative appearance-none border-0 bg-transparent [font:inherit]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center min-w-0",
                        collapsed
                          ? "flex-col gap-0.5 w-full"
                          : "space-x-2 flex-1"
                      )}
                    >
                      {collapsed ? (
                        <span className="flex w-full items-center justify-center">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-flex w-3 shrink-0" aria-hidden="true" />
                            <SidebarItemIcon
                              icon={item.icon}
                              className={classNames?.navItemText}
                            />
                            <span
                              className={cn(
                                "sidebar-group-caret inline-flex w-3 shrink-0 items-center justify-center text-current [&>svg]:h-3 [&>svg]:w-3 transition-transform duration-200 motion-reduce:transition-none",
                                groupOpen ? "rotate-180" : "rotate-0"
                              )}
                              aria-hidden="true"
                            >
                              {itemDropdownIcon}
                            </span>
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2 min-w-0 flex-1">
                          <SidebarItemIcon
                            icon={item.icon}
                            className={classNames?.navItemText}
                          />
                          <SidebarItemLabel
                            name={item.name}
                            collapsed={false}
                            className={classNames?.navItemText}
                          />
                        </span>
                      )}
                      {collapsed && (
                        <SidebarItemLabel
                          name={item.name}
                          collapsed
                          className={classNames?.navItemText}
                        />
                      )}
                    </span>
                    {!collapsed && (
                      <span
                        className={cn(
                          "transform transition-transform duration-200 motion-reduce:transition-none",
                          groupOpen ? "rotate-180" : "rotate-0"
                        )}
                        aria-hidden="true"
                      >
                        {itemDropdownIcon}
                      </span>
                    )}
                  </button>
                </ToolTip>
                {groupOpen && (
                  <div
                    id={groupId}
                    role="group"
                    aria-label={item.name}
                    className={cn(
                      collapsed
                        ? "sidebar-sub-panel flex flex-col items-center max-w-full min-w-0 box-border"
                        : "collapse-btn-wrapper",
                      classNames.subItem
                    )}
                  >
                    {item.subItems.map((subItem, subIndex) => {
                      if (subItem.component) {
                        const SubItemComponent = subItem.component;
                        return (
                          <div
                            key={`${index}-${subIndex}`}
                            className={cn(
                              "min-w-0 max-w-full",
                              collapsed && "flex flex-col items-center text-center"
                            )}
                            data-sidebar-item={subItem.name}
                          >
                            <SubItemComponent />
                            {collapsed && (
                              <SidebarItemLabel
                                name={subItem.name}
                                collapsed
                                className={classNames?.navItemText}
                              />
                            )}
                          </div>
                        );
                      }

                      return renderLink(subItem, `${index}-${subIndex}`);
                    })}
                  </div>
                )}
              </div>
            );
          }

          if (item.component) {
            const ItemComponent = item.component;
            return <ItemComponent key={index} />;
          }

          return renderLink(item, String(index));
        })}
      </nav>
      {children != null && (
        <div
          className={cn(
            "sidebar-chrome w-full shrink-0",
            collapsed && "flex flex-col items-center"
          )}
        >
          {children}
        </div>
      )}

      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "shrink-0 border-t border-gray-300",
          classNames.collapseButton,
          collapsed && "flex items-center justify-center"
        )}
      >
        {collapsed ? expandButtonText : collapseButtonText}
      </button>

      {footer && (
        <div className={classNames?.footer ?? "p-4 border-t border-gray-300"}>
          {footer}
        </div>
      )}
    </div>
  );
}
