import type { ReactNode } from "react";

export interface HeaderProps {
  title?: string;
  children?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
  containerClass?: string;
  titleStyle?: string;
  breadcrumbsStyle?: string;
}
