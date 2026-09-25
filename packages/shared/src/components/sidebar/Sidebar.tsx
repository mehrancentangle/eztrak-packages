import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import { ToolTip } from "../tooltip/ToolTip";
import type { SidebarItem, SidebarProps } from "./types";

export function Sidebar({
  className,
  sideCollapseWidth = "w-20",
  sidebarWidth = "w-48",
  header,
  children,
  footer,
  items = [],
  logoUrl = "",
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
  const [, setActiveLink] = useState<string>(location.pathname);
  const [subItemsCollapsed, setSubItemsCollapsed] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const toggleGroup = (group: string) => {
    setSubItemsCollapsed((prevState) => ({
      ...prevState,
      [group]: !prevState[group],
    }));
  };

  const isActive = (link: string) => {
    return location.pathname.startsWith(link);
  };

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden ${
        collapsed
          ? `${sideCollapseWidth} justify-center items-center collapsed`
          : `${sidebarWidth}`
      } transition-all duration-100 ${className ?? ""}`}
      {...rest}
    >
      {logoUrl && (
        <div
          className={cn(
            "flex items-center justify-center h-16 border-b border-gray-300",
            classNames.logoSection
          )}
        >
          <img src={logoUrl} alt={logoAltText} className="h-10" />
        </div>
      )}

      {header && (
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          {header}
        </div>
      )}

      <nav className={cn("flex-grow", classNames.navSection)}>
        {items.map((item, index) => {
          if (item.subItems) {
            return (
              <div
                key={index}
                className={`my-2 ${item?.subItems && "has-sub-items"}`}
              >
                <div
                  onClick={() => toggleGroup(item.name)}
                  data-sidebar-item={item.name}
                  data-tooltip-id={item.name}
                  className={`flex cursor-pointer dropdown-title-wrapper ${classNames?.navItem ?? ""}`}
                >
                  <ToolTip
                    text={item.tooltip || item.name}
                    placement={item.tooltipPlacement || "top"}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={classNames?.navItemText}>{item.icon}</span>
                      {!collapsed && (
                        <span className={classNames?.navItemText}>{item.name}</span>
                      )}
                    </div>
                  </ToolTip>
                  {!collapsed && (
                    <span
                      className={`transform transition-transform ${
                        subItemsCollapsed[item.name] ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      {itemDropdownIcon}
                    </span>
                  )}
                </div>
                {subItemsCollapsed[item.name] && (
                  <div className={cn("collapse-btn-wrapper", classNames.subItem)}>
                    {item.subItems.map((subItem: SidebarItem, subIndex: number) => {
                      if (subItem.component) {
                        const SubItemComponent = subItem.component;
                        return <SubItemComponent key={`${index}-${subIndex}`} />;
                      }

                      return (
                        <div
                          key={`${index}-${subIndex}`}
                          className="w-full"
                          data-sidebar-item={subItem.name}
                          data-tooltip-id={subItem.name}
                        >
                          <ToolTip
                            text={item.tooltip || item.name}
                            placement={item.tooltipPlacement || "top"}
                            className="block w-full"
                          >
                            <Link
                              to={subItem.link || "#"}
                              className={`flex ${classNames?.navItem ?? ""} ${
                                isActive(subItem?.link ?? "") ? "active" : ""
                              } ${item?.itemClassName}`}
                              onClick={() =>
                                subItem.link && setActiveLink(subItem.link || "")
                              }
                              title={subItem.tooltip || subItem.name}
                            >
                              <span
                                className={
                                  classNames.navItemText ?? "text-orange-600"
                                }
                              >
                                {subItem.icon}
                              </span>
                              {!collapsed && (
                                <span className={classNames.navItemText}>
                                  {subItem.name}
                                </span>
                              )}
                            </Link>
                          </ToolTip>
                        </div>
                      );
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

          return (
            <div
              key={index}
              className="w-full"
              data-sidebar-item={item.name}
              data-tooltip-id={item.name}
            >
              <ToolTip
                text={item.tooltip || item.name}
                placement={item.tooltipPlacement || "top"}
                className="block w-full"
              >
                <Link
                  to={item.link || "#"}
                  className={`flex ${classNames?.navItem ?? ""} ${
                    isActive(item.link || "") ? "active" : ""
                  } ${item?.itemClassName}`}
                  onClick={() => setActiveLink(item.link || "")}
                  title={item.tooltip || item.name}
                >
                  <span className={classNames.navItemText ?? "text-orange-600"}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className={classNames.navItemText}>{item.name}</span>
                  )}
                </Link>
              </ToolTip>
            </div>
          );
        })}
      </nav>
      {children}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn("", classNames.collapseButton) ?? "p-4 border-t border-gray-300"}
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
