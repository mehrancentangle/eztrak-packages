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

Confirmation dialog (SweetAlert2):

```js
import { confirmationAlert } from "@eztrak/shared/utils";

confirmationAlert(() => resetLayout(), {
  title: "Reset column layout to default",
  text: "Reset column order, widths, and visibility to defaults?",
  icon: "warning",
});
```

### Hooks

```js
import { usePaginationUrlSync, useGridHeight } from "@eztrak/shared/hooks";

const gridHeight = useGridHeight({ offset: 390 });
```

Pair `usePaginationUrlSync` with `CustomPagination` so URL query params stay in sync with your data fetch:

```tsx
import { useSearchParams } from "react-router-dom";
import { usePaginationUrlSync } from "@eztrak/shared/hooks";

const [searchParams, setSearchParams] = useSearchParams();
const [page, setPage] = useState(1);
const [perPage, setPerPage] = useState(20);

usePaginationUrlSync(
  searchParams,
  setSearchParams,
  page,
  setPage,
  perPage,
  setPerPage
);
```

### Components — CustomPagination

URL-driven pagination bar with page controls, results summary, items-per-page select, and an optional reset-columns button. Requires a React Router context (`useSearchParams`).

```tsx
import { CustomPagination } from "@eztrak/shared/components";

<CustomPagination
  paginationData={{
    currentPage: 1,
    pageCount: 10,
    perPage: 20,
    totalCount: 193,
  }}
  className="bg-white"
  pageSizeOptions={[10, 20, 30, 50, 100]}
  onResetLayout={handleResetLayout}
  layoutStatus={{
    isLayoutLoading,
    isLayoutSaving,
    isLayoutResetting,
  }}
/>
```

#### With loading state

```tsx
<CustomPagination
  paginationData={data ?? null}
  isLoading={isFetching}
/>
```

#### Custom URL param names

```tsx
<CustomPagination
  paginationData={paginationData}
  paramNames={{ page: "p", perPage: "size" }}
/>
```

#### Show all results (no paging)

```tsx
<CustomPagination
  paginationData={paginationData}
  showAllPagesOption
/>
```

When the user selects **All**, the component sets `perPage=-1` in the URL, hides page numbers, and shows `Showing All N Results`.

#### Standalone reset button

```tsx
import {
  ResetColumnsButton,
  TableLayoutToolbarControls,
} from "@eztrak/shared/components";

<ResetColumnsButton onReset={handleResetLayout} isLoading={isResetting} />

<TableLayoutToolbarControls
  onResetLayout={handleResetLayout}
  layoutStatus={{ isLayoutSaving: true }}
/>
```

`ResetColumnsButton` shows a SweetAlert2 confirmation before calling `onReset`.

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
import {
  cn,
  useGridHeight,
  EztrakTabs,
  CustomPagination,
} from "@eztrak/shared";
```

## Storybook

Run the component playground locally (dev-only, not published to npm):

```bash
npm run storybook
# or from the monorepo root:
npm run storybook -w @eztrak/shared
```

Opens on [http://localhost:6006](http://localhost:6006) with stories for `EztrakTabs`, `CustomPagination`, and `ResetColumnsButton`.

## Exports

| Subpath | Description |
| --- | --- |
| `@eztrak/shared` | Main entry — re-exports utils, hooks, and components |
| `@eztrak/shared/utils` | `cn`, `handleApiError`, `confirmationAlert`, date/format helpers, API error helpers, form field helpers |
| `@eztrak/shared/hooks` | `usePaginationUrlSync`, `useGridHeight` |
| `@eztrak/shared/components` | `EztrakTabs`, `CustomPagination`, `ResetColumnsButton`, `TableLayoutToolbarControls`, and related types |
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

### CustomPagination props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `paginationData` | `PaginationData \| null` | required | Server pagination metadata (`currentPage`, `pageCount`, `perPage`, `totalCount`) |
| `pageSizeOptions` | `number[]` | `[10, 20, 30, 50, 100]` | Options shown in the per-page select |
| `paginationPageSize` | `number[]` | — | Deprecated alias for `pageSizeOptions` |
| `isLoading` | `boolean` | `false` | Show loading state when data is not ready |
| `paramNames` | `{ page?: string; perPage?: string }` | `{ page: "page", perPage: "perPage" }` | URL query param keys |
| `onPageChange` | `(page: number) => void` | — | Called after page URL param is updated (1-based page) |
| `onPageSizeChange` | `(perPage: number) => void` | — | Called after per-page URL param is updated |
| `onResetLayout` | `() => void` | — | When set, shows a reset-columns button |
| `renderResetControl` | `(onReset: () => void) => ReactNode` | — | Custom reset control instead of the default button |
| `layoutStatus` | `LayoutStatus` | — | Disables reset button while layout is loading/saving/resetting |
| `showAllPagesOption` | `boolean` | `false` | Adds an "All" option to the page-size select (`perPage=-1` in URL) |
| `classNames` | `CustomPaginationClassNames` | — | Per-slot class overrides (`root`, `info`, `nav`, `pageButton`, `activePageButton`, `select`) |
| `className` | `string` | — | Root wrapper class |

`CustomPagination` writes `page` and `perPage` to the URL via `react-router-dom`. Your page should read those params, fetch data, and pass the result back as `paginationData`.

## Requirements

- Node.js 18+
- React 18+ (for hooks and components)
- `react-router-dom` (required for `CustomPagination` and `usePaginationUrlSync`)
- `sweetalert2` (required for `ResetColumnsButton` and `confirmationAlert`)
- Works with any bundler that supports the [Node.js `exports` field](https://nodejs.org/api/packages.html#exports)

## License

ISC
