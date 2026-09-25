import type { ComponentType, HTMLAttributes, ReactNode } from "react";

export interface SidebarItem {
  name: string;
  link?: string;
  icon?: ReactNode;
  subItems?: SidebarItem[];
  component?: ComponentType;
  tooltip?: string;
  tooltipPlacement?: "top" | "right" | "bottom" | "left";
  itemClassName?: string;
}

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  items?: SidebarItem[];
  logoUrl?: string;
  logoAltText?: string;
  collapseButtonText?: ReactNode;
  expandButtonText?: ReactNode;
  sideCollapseWidth?: string;
  sidebarWidth?: string;
  location?: {
    pathname?: string;
  };
  classNames?: {
    logoSection?: string;
    navSection?: string;
    groupItem?: string;
    subItem?: string;
    collapseButton?: string;
    navItemText?: string;
    footer?: string;
    navItem?: string;
    itemDropdown?: string;
  };
  itemDropdownIcon?: ReactNode;
  onCollapseChange?: (collapsed: boolean) => void;
  isCollapsed?: boolean;
}
