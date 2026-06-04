import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "../../utils/cn";
import type { EztrakTab, EztrakTabsProps } from "./types";

function getInitialTabId(
  tabs: EztrakTab[],
  defaultTabId?: string
): string | undefined {
  if (defaultTabId && tabs.some((t) => t.id === defaultTabId && !t.disabled)) {
    return defaultTabId;
  }
  return tabs.find((t) => !t.disabled)?.id;
}

function getEnabledTabIds(tabs: EztrakTab[]): string[] {
  return tabs.filter((t) => !t.disabled).map((t) => t.id);
}

export function EztrakTabs({
  tabs,
  activeTab,
  defaultTabId,
  onTabChange,
  showPanels = true,
  keepMounted = false,
  classNames,
  className,
}: EztrakTabsProps) {
  const baseId = useId().replace(/:/g, "");
  const isControlled = activeTab !== undefined && activeTab !== null;
  const [uncontrolledActive, setUncontrolledActive] = useState(() =>
    getInitialTabId(tabs, defaultTabId)
  );
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const displayActive = isControlled ? activeTab : uncontrolledActive;

  useEffect(() => {
    if (isControlled) return;
    const enabledIds = getEnabledTabIds(tabs);
    if (!displayActive || !enabledIds.includes(displayActive)) {
      const next = getInitialTabId(tabs, defaultTabId);
      if (next !== displayActive) {
        setUncontrolledActive(next);
      }
    }
  }, [tabs, defaultTabId, isControlled, displayActive]);

  const handleTabClick = useCallback(
    (tabId: string, disabled?: boolean) => {
      if (disabled) return;
      if (!isControlled) {
        setUncontrolledActive(tabId);
      }
      onTabChange?.(tabId);
    },
    [isControlled, onTabChange]
  );

  const focusTab = useCallback((tabId: string) => {
    tabRefs.current.get(tabId)?.focus();
  }, []);

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      const enabledIds = getEnabledTabIds(tabs);
      if (enabledIds.length === 0) return;

      const currentIndex = displayActive
        ? enabledIds.indexOf(displayActive)
        : -1;
      let nextIndex = currentIndex;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          nextIndex =
            currentIndex < 0
              ? 0
              : (currentIndex + 1) % enabledIds.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          nextIndex =
            currentIndex < 0
              ? enabledIds.length - 1
              : (currentIndex - 1 + enabledIds.length) % enabledIds.length;
          break;
        case "Home":
          event.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          event.preventDefault();
          nextIndex = enabledIds.length - 1;
          break;
        default:
          return;
      }

      const nextId = enabledIds[nextIndex];
      if (nextId) {
        handleTabClick(nextId);
        focusTab(nextId);
      }
    },
    [tabs, displayActive, handleTabClick, focusTab]
  );

  if (!tabs.length) {
    return null;
  }

  const wrapperClass = cn(
    "eztrak-tabs-wrapper",
    classNames?.wrapper,
    className
  );

  return (
    <div className={wrapperClass}>
      <div className="eztrak-tabs-container">
        <nav className="eztrak-tabs-nav" aria-label="Tabs">
          <ul
            role="tablist"
            className={cn("eztrak-tabs-list", classNames?.list)}
            onKeyDown={handleListKeyDown}
          >
            {tabs.map((tab) => {
              const isActive = displayActive === tab.id;
              const tabId = `${baseId}-tab-${tab.id}`;
              const panelId = `${baseId}-panel-${tab.id}`;

              return (
                <li
                  key={tab.id}
                  role="presentation"
                  className={cn(
                    "eztrak-tabs-item",
                    isActive && "eztrak-tabs-item-active",
                    classNames?.item,
                    isActive && classNames?.itemActive
                  )}
                >
                  <button
                    ref={(el) => {
                      if (el) {
                        tabRefs.current.set(tab.id, el);
                      } else {
                        tabRefs.current.delete(tab.id);
                      }
                    }}
                    type="button"
                    role="tab"
                    id={tabId}
                    aria-selected={isActive}
                    aria-controls={showPanels ? panelId : undefined}
                    tabIndex={isActive ? 0 : -1}
                    disabled={tab.disabled}
                    className={cn(
                      "eztrak-tabs-button",
                      isActive && "eztrak-tabs-button-active",
                      classNames?.button,
                      isActive && classNames?.buttonActive
                    )}
                    onClick={() => handleTabClick(tab.id, tab.disabled)}
                  >
                    {tab.icon ? (
                      <span
                        className={cn("eztrak-tabs-icon", classNames?.icon)}
                        aria-hidden
                      >
                        {tab.icon}
                      </span>
                    ) : null}
                    <span
                      className={cn("eztrak-tabs-label", classNames?.label)}
                    >
                      {tab.label}
                    </span>
                    {isActive ? (
                      <span
                        className={cn(
                          "eztrak-tabs-underline",
                          classNames?.underline
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {showPanels ? (
          <div className={cn("eztrak-tabs-content", classNames?.content)}>
            {tabs.map((tab) => {
              const isActive = displayActive === tab.id;
              const panelId = `${baseId}-panel-${tab.id}`;
              const tabId = `${baseId}-tab-${tab.id}`;

              if (!keepMounted && !isActive) {
                return null;
              }

              return (
                <div
                  key={tab.id}
                  id={panelId}
                  role="tabpanel"
                  aria-labelledby={tabId}
                  hidden={!isActive}
                  className={cn("eztrak-tabs-panel", classNames?.panel)}
                >
                  {tab.content}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
