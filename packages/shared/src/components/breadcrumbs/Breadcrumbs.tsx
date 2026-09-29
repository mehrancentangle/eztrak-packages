import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import type { BreadcrumbRoute, BreadcrumbsProps } from "./types";

const DEFAULT_BACKGROUND = "#F7F7F5";
const DEFAULT_INACTIVE = "#6B7280";
const DEFAULT_ACTIVE = "#111111";
const DEFAULT_SEPARATOR = "#9CA3AF";

const CRUMB_LAYOUT =
  "inline-flex items-center gap-1.5 whitespace-nowrap leading-5 rounded-sm";

const LINK_INTERACTION =
  "font-normal transition-colors duration-200 motion-reduce:transition-none hover:!text-[color-mix(in_srgb,var(--bc-inactive)_65%,#111111)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]";

type BreadcrumbNavStyle = CSSProperties & {
  "--bc-inactive": string;
};

function BreadcrumbChevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M4.5 2.5L8 6L4.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function asTitleMap(
  customTitles: BreadcrumbsProps["customTitles"]
): Record<string, string> {
  if (Object.prototype.toString.call(customTitles) !== "[object Object]") {
    return {};
  }
  return customTitles as Record<string, string>;
}

function findRoute(
  pathname: string,
  routes: BreadcrumbRoute[],
  parentPath = ""
): BreadcrumbRoute | null {
  for (const route of routes) {
    const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, "/");
    if (fullPath === pathname) {
      return route;
    }
    if (route.children) {
      const childRoute = findRoute(pathname, route.children, fullPath);
      if (childRoute) {
        return childRoute;
      }
    }
  }
  return null;
}

function getLastParam(str: string) {
  return str.endsWith("/")
    ? str.slice(0, -1).split("/").pop()
    : str.split("/").pop();
}

type Crumb = {
  key: string;
  to: string;
  title: string;
  icon: ReactNode | null;
  isCurrent: boolean;
  isLink: boolean;
};

export function Breadcrumbs({
  routes = [],
  containerClassName,
  linkClassName = "",
  separatorClassName = "",
  separator,
  activeClassName = "font-semibold",
  customTitles = {},
  customIcons = {},
  prefix,
  suffix,
  nonClickablePaths = [],
  backgroundColor = DEFAULT_BACKGROUND,
  inactiveColor = DEFAULT_INACTIVE,
  activeColor = DEFAULT_ACTIVE,
  separatorColor = DEFAULT_SEPARATOR,
  iconColor,
  iconClassName,
  showHome = false,
}: BreadcrumbsProps) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((segment) => segment);
  const titles = asTitleMap(customTitles);

  const getTitle = (pathname: string) => {
    const match = findRoute(pathname, routes);
    if (match && match.title) {
      return match.title;
    }

    const lastParamPath = getLastParam(pathname);
    if (lastParamPath && titles[lastParamPath]) {
      return titles[lastParamPath];
    }

    if (lastParamPath) {
      return lastParamPath;
    }

    return pathname;
  };

  const getIcon = (pathname: string) => {
    const segment = getLastParam(pathname);
    if (segment && customIcons[segment]) {
      return customIcons[segment];
    }
    return null;
  };

  const crumbs: Crumb[] = [];

  if (showHome) {
    crumbs.push({
      key: "home",
      to: "/",
      title: titles.home || "Home",
      icon: customIcons.home ?? null,
      isCurrent: pathnames.length === 0,
      isLink: pathnames.length > 0,
    });
  }

  pathnames.forEach((segment, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
    const isCurrent = index === pathnames.length - 1;
    const isNonClickable = nonClickablePaths.some(
      (token) => to.includes(token) || segment === token
    );

    crumbs.push({
      key: to,
      to,
      title: getTitle(to),
      icon: getIcon(to),
      isCurrent,
      isLink: !isCurrent && !isNonClickable,
    });
  });

  const navStyle: BreadcrumbNavStyle = {
    backgroundColor,
    "--bc-inactive": inactiveColor,
  };

  const inactiveClassName = cn(CRUMB_LAYOUT, LINK_INTERACTION, linkClassName);
  const staticInactiveClassName = cn(CRUMB_LAYOUT, "font-normal", linkClassName);
  const currentClassName = cn(CRUMB_LAYOUT, activeClassName);

  const renderCrumb = (crumb: Crumb) => {
    const content = (
      <>
        {crumb.icon ? (
          <span
            className={cn("inline-flex shrink-0 items-center", iconClassName)}
            style={iconColor ? { color: iconColor } : undefined}
          >
            {crumb.icon}
          </span>
        ) : null}
        {crumb.title}
      </>
    );

    if (crumb.isCurrent) {
      return (
        <span
          className={currentClassName}
          style={{ color: activeColor }}
          aria-current="page"
        >
          {content}
        </span>
      );
    }

    if (crumb.isLink) {
      return (
        <Link
          to={crumb.to}
          className={inactiveClassName}
          style={{ color: inactiveColor }}
        >
          {content}
        </Link>
      );
    }

    return (
      <span className={staticInactiveClassName} style={{ color: inactiveColor }}>
        {content}
      </span>
    );
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex w-full flex-row items-center gap-2 overflow-x-auto px-4 py-3 text-sm leading-5",
        containerClassName
      )}
      style={navStyle}
    >
      {prefix ? <div className="breadcrumb-prefix">{prefix}</div> : null}
      <ol className="flex min-w-0 flex-row flex-nowrap items-center gap-2">
        {crumbs.map((crumb, index) => (
          <li key={crumb.key} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex shrink-0 items-center",
                  separatorClassName
                )}
                style={{ color: separatorColor }}
              >
                {separator === undefined ? (
                  <BreadcrumbChevron />
                ) : isValidElement(separator) ? (
                  cloneElement(separator)
                ) : (
                  separator
                )}
              </span>
            ) : null}
            {renderCrumb(crumb)}
          </li>
        ))}
      </ol>
      {suffix ? <div className="breadcrumb-suffix">{suffix}</div> : null}
    </nav>
  );
}
