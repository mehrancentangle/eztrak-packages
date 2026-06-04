# @eztrak/shared

Shared utilities, hooks, and UI components for Eztrak applications.

## Install

```bash
npm install @eztrak/shared
```

Peer dependencies (hooks + `handleApiError` + components):

```bash
npm install react react-dom react-router-dom react-hot-toast sweetalert2
```

Your app must render `<Toaster />` from react-hot-toast (e.g. in your root layout).

## Usage

### Utils

```js
import { cn, formatDate, getApiError, isEmpty } from "@eztrak/shared/utils";

<div className={cn("px-4 py-2", isActive && "bg-blue-500", className)} />
```

`cn` combines [`clsx`](https://github.com/lukeed/clsx) with [`tailwind-merge`](https://github.com/dcastil/tailwind-merge).

RTK Query errors (toast or SweetAlert — no extra wiring):

```js
import { handleApiError } from "@eztrak/shared/utils";

// Toasts each validation message (or a single generic error)
handleApiError(error, { fallbackMessage: "Save failed" });

// SweetAlert list for validation errors
handleApiError(error, { showAlert: true });
```

### Hooks

```js
import { usePaginationUrlSync, useGridHeight } from "@eztrak/shared/hooks";

const gridHeight = useGridHeight({ offset: 390 });
```

### Components — EztrakTabs

Import styles once in your app entry or layout:

```ts
import "@eztrak/shared/components/tabs.css";
```

#### With panels

```tsx
import { EztrakTabs } from "@eztrak/shared/components";
import "@eztrak/shared/components/tabs.css";

const tabs = [
  { id: "daily", label: "Daily Report", content: <DailyReport /> },
  { id: "cumulative", label: "Cumulative", content: <CumulativeReport /> },
];

<EztrakTabs
  tabs={tabs}
  activeTab={activeView}
  onTabChange={setActiveView}
/>
```

#### Nav only (content rendered elsewhere)

```tsx
<EztrakTabs
  tabs={[
    { id: "grid", label: "Grid", icon: <GridIcon /> },
    { id: "table", label: "Table" },
  ]}
  activeTab={view}
  onTabChange={handleViewChange}
  showPanels={false}
/>
```

#### Controlled with URL (react-router)

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const activeTab = searchParams.get("view") ?? "dashboard";

<EztrakTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={(id) => {
    setSearchParams((prev) => {
      prev.set("view", id);
      return prev;
    });
  }}
  showPanels={false}
/>
```

#### Keep heavy panels mounted

```tsx
<EztrakTabs tabs={tabs} activeTab={section} onTabChange={setSection} keepMounted />
```

#### Theming — CSS variables

```css
:root {
  --eztrak-tabs-accent: #2563eb;
  --eztrak-tabs-inactive-bg: #f3f4f6;
  --eztrak-tabs-active-bg: #ffffff;
  --eztrak-tabs-label-inactive: #9ca3af;
  --eztrak-tabs-label-active: #1f2937;
  --eztrak-tabs-radius: 8px;
  --eztrak-tabs-gap: 12px;
  --eztrak-tabs-padding: 12px 20px;
}
```

#### Theming — Tailwind `classNames` (style in JSX, no extra CSS file)

Pass classes per slot — they merge with the default `eztrak-tabs-*` styles via `tailwind-merge`:

```tsx
<EztrakTabs
  tabs={tabs}
  activeTab={id}
  onTabChange={setId}
  classNames={{
    list: "mb-4",
    content: "bg-white rounded-xl border border-gray-100 shadow-sm",
    panel: "px-6 py-4",
    button: "rounded-full px-6",
    underline: "h-1 bg-blue-600",
  }}
/>
```

| `classNames` key | Element |
| --- | --- |
| `wrapper` | Outermost wrapper (or use top-level `className`) |
| `container` | Inner layout container |
| `nav` | Tab navigation region |
| `list` | Tab list (`<ul role="tablist">`) |
| `item` / `itemActive` | Tab `<li>` |
| `button` / `buttonActive` | Tab button |
| `label` / `icon` / `underline` | Label, icon, active underline |
| `content` | Panels wrapper |
| `panel` | Each tab panel |

### Root import

```js
import { cn, useGridHeight, EztrakTabs } from "@eztrak/shared";
```

## Exports

| Subpath | Description |
| --- | --- |
| `@eztrak/shared` | Main entry — re-exports utils, hooks, and components |
| `@eztrak/shared/utils` | `cn`, `handleApiError`, date/format helpers, API error helpers, form field helpers |
| `@eztrak/shared/hooks` | `usePaginationUrlSync`, `useGridHeight` |
| `@eztrak/shared/components` | `EztrakTabs` and related types |
| `@eztrak/shared/components/tabs.css` | Default tab styles (CSS variables) |

### EztrakTabs props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `EztrakTab[]` | required | Tab definitions (`id`, `label`, optional `content`, `icon`, `disabled`) |
| `activeTab` | `string` | — | Controlled active tab id |
| `defaultTabId` | `string` | first enabled tab | Initial tab when uncontrolled |
| `onTabChange` | `(id: string) => void` | — | Called when a tab is selected |
| `showPanels` | `boolean` | `true` | Render tab panels; set `false` for nav-only |
| `keepMounted` | `boolean` | `false` | Keep inactive panels in DOM (hidden) |
| `classNames` | `EztrakTabsClassNames` | — | Per-slot class overrides |
| `className` | `string` | — | Shorthand for `classNames.wrapper` |

Keyboard: Arrow keys move between tabs; Home/End jump to first/last enabled tab.

## Requirements

- Node.js 18+
- React 18+ (for hooks and components)
- Works with any bundler that supports the [Node.js `exports` field](https://nodejs.org/api/packages.html#exports)

## License

ISC
