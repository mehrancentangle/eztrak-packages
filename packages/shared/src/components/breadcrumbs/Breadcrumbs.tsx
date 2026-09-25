import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import type { BreadcrumbRoute, BreadcrumbsProps } from "./types";

const INACTIVE_LINK_CLASS =
  "inline-flex items-center justify-center text-[#5D6D7F] bg-white px-4 py-2 rounded-lg transition-colors duration-300 hover:text-[#516378]";

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

export function Breadcrumbs({
  routes = [],
  containerClassName,
  linkClassName = "",
  separatorClassName = "",
  separator = "/",
  activeClassName = "font-bold whitespace-pre",
  customTitles = {},
  customIcons = {},
  prefix,
  suffix,
  nonClickablePaths = [],
}: BreadcrumbsProps) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((segment) => segment);
  const titles = asTitleMap(customTitles);
  const inactiveLinkClassName = cn(INACTIVE_LINK_CLASS, linkClassName);

  const getTitle = (pathname: string) => {
    const match = findRoute(pathname, routes);
    if (match && match.title) {
      return match.title;
    }

    const titleKeys = Object.keys(titles);
    const paramMatch =
      pathname.split("/").find((segment) => titleKeys.includes(segment)) || "";
    if (paramMatch && titles[paramMatch]) {
      return titles[paramMatch];
    }

    const lastParamPath = getLastParam(pathname);
    if (lastParamPath) {
      return lastParamPath;
    }

    return pathname;
  };

  const getIcon = (pathname: string) => {
    const iconKeys = Object.keys(customIcons);
    const matchedSegment = pathname
      .split("/")
      .find((segment) => iconKeys.includes(segment));
    if (matchedSegment && customIcons[matchedSegment]) {
      return customIcons[matchedSegment];
    }
    return null;
  };

  return (
    <div
      className={cn(
        "flex flex-row gap-2 items-center text-sm text-secondary",
        containerClassName
      )}
    >
      {prefix && <div className="breadcrumb-prefix">{prefix}</div>}
      <Link to="/" className={inactiveLinkClassName}>
        {customIcons.home && <span className="mr-1">{customIcons.home}</span>}
        {titles.home || "Home"}
      </Link>
      {pathnames.map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const title = getTitle(to);
        const icon = getIcon(to);
        const isNonClickable = nonClickablePaths.some(
          (token) => to.includes(token) || segment === token
        );
        const crumb = (
          <>
            {icon && <span className="mr-1">{icon}</span>}
            {title}
          </>
        );

        return (
          <Fragment key={to}>
            <span className={separatorClassName}>{separator}</span>
            {isLast || isNonClickable ? (
              <span className={isLast ? activeClassName : linkClassName}>{crumb}</span>
            ) : (
              <Link to={to} className={inactiveLinkClassName}>
                {crumb}
              </Link>
            )}
          </Fragment>
        );
      })}
      {suffix && <div className="breadcrumb-suffix">{suffix}</div>}
    </div>
  );
}
