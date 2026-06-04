import type { ReactNode } from "react";

export type EztrakTab = {
  id: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
};

export type EztrakTabsClassNames = {
  wrapper?: string;
  container?: string;
  nav?: string;
  list?: string;
  item?: string;
  itemActive?: string;
  button?: string;
  buttonActive?: string;
  label?: string;
  icon?: string;
  underline?: string;
  panel?: string;
  content?: string;
};

export type EztrakTabsProps = {
  tabs: EztrakTab[];
  activeTab?: string;
  defaultTabId?: string;
  onTabChange?: (id: string) => void;
  /** When false, only the tab list is rendered (nav-only). Default: true */
  showPanels?: boolean;
  /** Keep inactive panels in the DOM (hidden). Default: false */
  keepMounted?: boolean;
  classNames?: EztrakTabsClassNames;
  /** Shorthand for classNames.wrapper */
  className?: string;
};
