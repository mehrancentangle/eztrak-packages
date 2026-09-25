import type { ReactNode } from "react";

export interface BreadcrumbRoute {
  path: string;
  title?: string;
  children?: BreadcrumbRoute[];
}

export interface BreadcrumbsProps {
  routes?: BreadcrumbRoute[];
  containerClassName?: string;
  linkClassName?: string;
  separatorClassName?: string;
  separator?: ReactNode;
  activeClassName?: string;
  customTitles?: Record<string, string> | string;
  customIcons?: Record<string, ReactNode>;
  prefix?: ReactNode;
  suffix?: ReactNode;
  nonClickablePaths?: string[];
}
