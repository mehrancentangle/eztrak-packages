# @eztrak/shared

Shared utilities, hooks, and UI components for Eztrak applications.

## Install

```bash
npm install @eztrak/shared
```

Peer dependencies:

```bash
npm install react react-dom react-router-dom react-hot-toast sweetalert2 react-icons framer-motion react-tooltip
```

Your app must render `<Toaster />` from `react-hot-toast` (e.g. in your root layout).

Import loader styles once if you use the `Loader` component:

```ts
import "@eztrak/shared/components/loader.css";
```

`CustomCellEditor` does **not** require `loader.css` — it uses an inline SVG spinner for the save button.

## Development

From the monorepo root:

```bash
npm run build:shared
npm run storybook
```

From `packages/shared`:

```bash
npm run build
npm run storybook
npm run build:storybook
```

## Usage

### Utils

```js
import { cn, formatDate, getApiError, isEmpty } from "@eztrak/shared/utils";

<div className={cn("px-4 py-2", isActive && "bg-blue-500", className)} />
```

`cn` combines [`clsx`](https://github.com/lukeed/clsx) with [`tailwind-merge`](https://github.com/dcastil/tailwind-merge).

Format a number with thousands separators:

```js
import { formatNumber } from "@eztrak/shared/utils";

formatNumber(1234567); // "1,234,567"
formatNumber("1234567.5"); // "1,234,567.5"
formatNumber(null); // "0"
```

Truncate text or file names (keeps the file extension):

```js
import { truncateText, truncateFileName } from "@eztrak/shared/utils";

truncateText("A very long description here", 10); // "A very ..."
truncateFileName("annual-financial-report-2026.pdf", 20); // "annual-financ....pdf"
```

Browser local storage helpers (JSON serialize/deserialize, safe fallbacks):

```js
import {
  getItem,
  setItem,
  loadUserState,
  saveUserState,
  USER_STATE_STORAGE_KEY,
} from "@eztrak/shared/utils";

// User auth state (default key: "authState")
saveUserState({ access_token: "...", name: "Ali" });
const user = loadUserState();

// Generic key/value storage
setItem("selectedProject", { id: 1, name: "Project A" });
const project = getItem("selectedProject");

// Explicit fallback when a key is missing
const permissions = getItem("userPermissionsNew", []);
```

Backward-compatible aliases are also exported: `get` / `set`, `getItemFromLocalStorage`, `storeItemInLocalStorage`, and `saveItemLocalStorage`.

RTK Query errors (toast or SweetAlert — no extra wiring):

```js
import { handleApiError } from "@eztrak/shared/utils";

// Toasts each validation message (or a single generic error)
handleApiError(error, { fallbackMessage: "Save failed" });

// SweetAlert list for validation errors
handleApiError(error, { showAlert: true });
```

### confirmationAlert

Standard SweetAlert2 confirmation dialog for all Eztrak apps (Main, Vault, Pilot, PBF). Use **one function** with an options object — no per-module copies in `utils.js`.

**Import:**

```js
import { confirmationAlert } from "@eztrak/shared";
// or
import { confirmationAlert } from "@eztrak/shared/utils";
```

**Signature:**

```ts
confirmationAlert(
  onConfirm: () => void | Promise<void>,
  options?: ConfirmationAlertOptions
): void
```

`onConfirm` may be sync or `async`. When a loader is active, the modal stays open until `onConfirm` resolves; on failure it shows an error message inside the dialog.

#### Options

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"Are you sure?"` (or `"Confirmation Required"` when `inputExpectedValue` is set) | Dialog heading |
| `text` | `string` | — | Plain-text message (ignored when `html` is used without input) |
| `html` | `string` | — | Custom HTML body (e.g. project delete instructions) |
| `icon` | `"warning" \| "info" \| "question" \| "error" \| "success"` | `"warning"` | SweetAlert2 icon |
| `confirmButtonText` | `string` | `"Yes"` | Confirm button label |
| `cancelButtonText` | `string` | `"Cancel"` | Cancel button label |
| `confirmButtonColor` | `string` | `"#FF7335"` | Confirm button color (brand orange) |
| `cancelButtonColor` | `string` | `"#ff0000"` | Cancel button color |
| `showLoaderOnConfirm` | `boolean` | `false` | Show loader while `onConfirm` runs (API deletes/updates) |
| `inputExpectedValue` | `string` | — | User must type this value to confirm (trimmed, **case-sensitive**) |
| `inputPlaceholder` | `string` | `"Type confirmation text to proceed"` | Placeholder for the confirmation input |
| `reverseButtons` | `boolean` | — | Swap Cancel / Confirm order (e.g. logout) |
| `focusCancel` | `boolean` | — | Focus Cancel on open (e.g. logout) |
| `zIndex` | `number` | — | Stack the modal above tables/overlays |

#### Behavior modes

1. **Simple confirm** — no `showLoaderOnConfirm`, no `inputExpectedValue`  
   User clicks Yes → `onConfirm()` runs → modal closes.

2. **Loader confirm** — `showLoaderOnConfirm: true`  
   User clicks confirm → loader → `onConfirm()` awaited → success closes modal; error shows validation message and keeps modal open.

3. **Typed confirm** — `inputExpectedValue` set  
   Input field appears; user must type the exact value (`typed.trim() === expected.trim()`). Loader is enabled automatically.

#### Examples

**Simple Yes/No (column reset, generic confirm):**

```js
confirmationAlert(() => resetLayout(), {
  title: "Reset column layout to default",
  text: "Reset column order, widths, and visibility to defaults?",
  icon: "warning",
});
```

**Custom button colors:**

```js
confirmationAlert(() => handleDelete(), {
  title: "Delete this item?",
  confirmButtonText: "Yes, delete it!",
  confirmButtonColor: "#B91C1C",
  cancelButtonColor: "#6b7280",
  showLoaderOnConfirm: true,
});
```

**Bulk delete with API loader:**

```js
confirmationAlert(async () => {
  await dispatch(deleteItems(ids)).unwrap();
}, {
  text: "Are you sure you want to delete selected items?",
  confirmButtonText: "OK",
  showLoaderOnConfirm: true,
});
```

**Type `DELETE` to confirm:**

```js
confirmationAlert(() => bulkDelete(), {
  text: "Are you sure you want to delete selected items?",
  inputExpectedValue: "DELETE",
  confirmButtonText: "Confirm",
});
```

**Delete project — type project name:**

```js
confirmationAlert(async () => {
  await deleteProject(projectId);
}, {
  title: "Delete Project",
  html: `
    <p style="font-size:14px">To confirm, please type the project name below:</p>
    <p style="font-weight:bold;color:#d9534f">${projectName}</p>
  `,
  inputExpectedValue: projectName,
  inputPlaceholder: "Enter project name",
  confirmButtonText: "Delete",
  showLoaderOnConfirm: true,
});
```

**Logout:**

```js
confirmationAlert(() => authService.logout(), {
  title: "Logout Confirmation",
  text: "Are you sure you want to logout?",
  icon: "question",
  confirmButtonText: "Yes, Logout",
  cancelButtonColor: "#6b7280",
  reverseButtons: true,
  focusCancel: true,
});
```

**Modal above AG Grid / overlays:**

```js
confirmationAlert(() => deleteRow(), {
  text: "Are you sure?",
  showLoaderOnConfirm: true,
  zIndex: 9999,
});
```

#### Replacing local helpers

When migrating, remove duplicate functions from app `utils.js` and use `confirmationAlert` from `@eztrak/shared` instead:

| Old local function | Replacement |
| --- | --- |
| `confirmationAlert(onConfirm, text, icon)` (main-app 3-arg) | `confirmationAlert(onConfirm, { text, icon, confirmButtonText: "OK" })` |
| `confirmationAlert(onConfirm, { ... })` (vault/pilot/pbf) | Same options; change import to `@eztrak/shared` |
| `showDeleteConfirmation(onConfirm)` | `confirmationAlert(onConfirm, { text: "...", confirmButtonText: "OK", showLoaderOnConfirm: true })` |
| `showDeletePrompt(onConfirm, projectName)` | `confirmationAlert(onConfirm, { title: "Delete Project", html: "...", inputExpectedValue: projectName, showLoaderOnConfirm: true, confirmButtonText: "Delete" })` |
| `showLogoutConfirmation(onConfirm)` | `confirmationAlert(onConfirm, { title: "Logout Confirmation", text: "...", icon: "question", reverseButtons: true, focusCancel: true, cancelButtonColor: "#6b7280" })` |
| `confirmationAlertWithInput(onConfirm, "DELETE", text)` | `confirmationAlert(onConfirm, { text, inputExpectedValue: "DELETE", confirmButtonText: "Confirm" })` |

**Not replaced by this helper:** `showDeleteConfirmationAlert` (red button + inline “Deleting…” spinner on the button) — keep that component or pass equivalent colors + `showLoaderOnConfirm` if the default center loader is acceptable.

**Direct `Swal.fire({ ... })` calls** in budget/RFQ/forecast flows are separate one-off UIs; migrate only when those screens are touched.

#### TypeScript

```ts
import {
  confirmationAlert,
  type ConfirmationAlertOptions,
} from "@eztrak/shared";
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

### Components — CustomCellEditor

AG Grid cell editor with inline save/cancel buttons, keyboard shortcuts (Enter to save, Escape to cancel), and toast feedback. Implements the AG Grid `ICellEditor` ref API (`getValue`, `isCancelBeforeStart`, `isCancelAfterEnd`).

Your app owns the API call via `onSave` — the package does not use RTK Query or app-specific endpoints.

For narrow columns, set `cellEditorPopup: true` on the column definition so the editor (and save/cancel buttons) is not clipped.

```tsx
import { CustomCellEditor } from "@eztrak/shared/components";
import { ELITE_API } from "../constants/apiConstants";
import { createCellEditorOnSave } from "../utils/cellEditorOnSave";

// In column defs:
{
  field: "name",
  editable: true,
  cellEditor: CustomCellEditor,
  cellEditorPopup: true,
  cellEditorSelector: (params) => ({
    component: CustomCellEditor,
    params: {
      value: params.value,
      name: "name",
      entityId: params.data.id,
      entityName: "Package",
      inputType: "text",
      onSave: createCellEditorOnSave([ELITE_API.PACKAGE]),
      dropdownOptions: [], // when inputType is "dropdown"
    },
  }),
}
```

Example `createCellEditorOnSave` helper (elite-pilot pattern):

```js
import { ELITE_API } from "../constants/apiConstants";
import { store } from "../redux/store";
import { generalApi } from "../redux/api/generalApi";

export function createCellEditorOnSave(invalidate = []) {
  return async (payload) => {
    const result = await store.dispatch(
      generalApi.endpoints.updateRecord.initiate({
        endpoint: ELITE_API.SAVE_CELL_EDIT,
        data: payload,
        invalidate: invalidate.map((endpoint) => ({
          type: "General",
          id: endpoint,
        })),
      })
    );
    if (result.error) {
      throw new Error(result.error?.data?.message || "Failed to update record");
    }
  };
}
```

#### Input types

| `inputType` | Behavior |
| --- | --- |
| `text` | Standard text input |
| `number` | Numeric input (filters non-numeric characters); `propertyValue` is sent as a `number` |
| `date` | Date picker (`YYYY-MM-DD` via `toDateInputValue`) |
| `dropdown` | Select from `dropdownOptions` |

Save is disabled when the value is unchanged (compares as strings so `42` and `"42"` are treated as equal). Pressing Enter while a save is in progress does not submit twice.

### Components — ResetFiltersButton

Clears all URL search params (`react-router-dom`) in one click. Self-contained — no app `Button` needed.

```tsx
import { ResetFiltersButton } from "@eztrak/shared/components";

// Default look + reset icon
<ResetFiltersButton />

// Custom label and an extra callback after reset
<ResetFiltersButton label="Clear" onReset={() => refetch()} />

// Override styles (e.g. solid red) and hide the icon
<ResetFiltersButton icon={null} className="bg-red-500 text-white border-0" />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Reset Filters"` | Button text |
| `icon` | `ReactNode` | reset icon | Leading icon; pass `null` to hide |
| `className` | `string` | — | Classes merged with the default styles |
| `onReset` | `() => void` | — | Called after search params are cleared |
| `disabled` | `boolean` | `false` | Disables the button |

### Components — SearchInput

URL-synced search field with optional debounced live search. Requires a React Router context (`useSearchParams`).

```tsx
import { SearchInput } from "@eztrak/shared/components";

// Submit on Enter or search icon click (updates ?query= in the URL)
<SearchInput placeholder="Search items..." />
```

#### Live search (debounced)

```tsx
<SearchInput
  placeholder="Search..."
  liveSearch
  debounceDelay={500}
/>
```

#### Custom URL param name

```tsx
<SearchInput defaultParam="search" placeholder="Find a user..." />
```

#### Custom styling and icon

```tsx
<SearchInput
  searchWrapperClass="border border-gray-200 shadow-sm"
  searchClassName="w-full"
  searchIconClassName="text-blue-500"
  showIcon
/>
```

#### Hide icon / custom icon

```tsx
import { HiOutlineSearch } from "react-icons/hi";

<SearchInput showIcon={false} />

<SearchInput customIcon={<HiOutlineSearch className="h-5 w-5" />} />
```

`SearchInput` reads and writes a single query param (default `query`). Clearing the input removes that param from the URL. The input stays in sync when the URL changes externally (e.g. browser back/forward or `ResetFiltersButton`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` | `"Search..."` | Input placeholder |
| `defaultParam` | `string` | `"query"` | URL search param key |
| `defaultValue` | `string` | — | Initial value when the param is absent |
| `liveSearch` | `boolean` | `false` | Update URL on input change (debounced) |
| `debounceDelay` | `number` | `500` | Debounce delay in ms when `liveSearch` is true |
| `showIcon` | `boolean` | `true` | Show the submit/search icon button |
| `customIcon` | `ReactNode \| null` | `null` | Replace the default search icon |
| `name` | `string` | `"search"` | Form input `name` (used on submit) |
| `type` | `string` | `"search"` | Input `type` attribute |
| `searchWrapperClass` | `string` | — | Classes for the form wrapper |
| `searchClassName` | `string` | — | Classes for the input |
| `searchBtn` | `string` | — | Classes for the icon button |
| `searchIconClassName` | `string` | — | Classes for the default search icon |

Also accepts standard `<input>` HTML attributes (except `name`, `type`, `value`, `onChange`, and `defaultValue`, which are managed internally).

### Components — TooltipText

Displays truncated text with the full value available on hover or keyboard focus. Uses `react-tooltip` for placement and delay behavior.

```tsx
import { TooltipText } from "@eztrak/shared/components";

<TooltipText text="A very long material description" maxLength={20} />

<TooltipText
  text={row.description}
  placement="bottom"
  delayShow={300}
  tooltipWhenTruncatedOnly
/>
```

For lower-level composition, use `ToolTip` directly:

```tsx
import { ToolTip } from "@eztrak/shared/components";

<ToolTip text="Full details" placement="right">
  <button type="button">Info</button>
</ToolTip>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string \| number \| null` | `""` | Full value shown inside the tooltip |
| `maxLength` | `number` | `20` | Visible truncated text length |
| `fallback` | `string` | `"-"` | Displayed when `text` is empty |
| `placement` | `PlacesType` | `"top"` | Tooltip placement from `react-tooltip` |
| `delayShow` / `delayHide` | `number` | — | Tooltip delay in milliseconds |
| `className` | `string` | — | Classes for the tooltip trigger wrapper |
| `textClassName` | `string` | — | Classes for the visible text |
| `tooltipClassName` | `string` | — | Classes for the tooltip popup |
| `tooltipStyle` | `CSSProperties` | — | Inline style overrides for the tooltip popup |
| `showTooltip` | `boolean` | `true` | Disable tooltip while still rendering truncated text |
| `tooltipWhenTruncatedOnly` | `boolean` | `false` | Only show tooltip when truncation occurs |

### Components — CardSkeleton

Card-shaped loading placeholder for project cards, folders, user cards, and similar content. The default output matches the existing app `CardSkeleton` layout: avatar placeholder plus two text bars.

```tsx
import { CardSkeleton } from "@eztrak/shared/components";

// Existing app behavior
<CardSkeleton />

// Render multiple placeholders
<CardSkeleton count={4} className="rounded-xl bg-white shadow-sm" />

// Image/card content variant
<CardSkeleton
  variant="image"
  lines={3}
  lineWidths={["w-48", "w-64", "w-40"]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"profile" \| "image" \| "content"` | `"profile"` | Preset layout. `profile` shows avatar, `image` shows image block, `content` shows only text lines |
| `count` | `number` | `1` | Number of skeleton cards to render |
| `lines` | `number` | `2` | Number of text placeholder lines |
| `lineWidths` | `string[]` | `["w-32", "w-48"]` | Tailwind width classes for each line |
| `showAvatar` | `boolean` | variant-based | Override avatar visibility |
| `showImage` | `boolean` | variant-based | Override image placeholder visibility |
| `animationDuration` | `CSSProperties["animationDuration"]` | `"0.7s"` | Pulse animation duration |
| `className` | `string` | — | Extra classes for each skeleton card |
| `avatarClassName` | `string` | — | Extra classes for the avatar placeholder |
| `imageClassName` | `string` | — | Extra classes for the image placeholder |
| `contentClassName` | `string` | — | Extra classes for the content row |
| `lineClassName` | `string` | — | Extra classes for each text line |
| `srLabel` | `string` | `"Loading..."` | Screen-reader loading label |

### Components — Loader

Spinner for full-page or inline loading states. Requires `loader.css`:

```tsx
import { Loader } from "@eztrak/shared/components";
import "@eztrak/shared/components/loader.css";

<Loader size="36px" color="#F54C00" />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `string` | `"50px"` | Spinner diameter |
| `color` | `string` | `"#F54C00"` | Spinner accent color |
| `speed` | `string` | `"1s"` | Animation duration |
| `className` | `string` | — | Extra class on the spinner element |

### Components — Modal

Animated modal dialog (uses `framer-motion`).

```tsx
import { Modal } from "@eztrak/shared/components";

<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm">
  <p>Modal content</p>
</Modal>
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
import {
  cn,
  confirmationAlert,
  handleApiError,
  useGridHeight,
  EztrakTabs,
  CustomPagination,
  SearchInput,
  CustomCellEditor,
  Loader,
  Modal,
} from "@eztrak/shared";
```

## Storybook

Run the component playground locally (dev-only, not published to npm):

```bash
# From monorepo root
npm run storybook

# From packages/shared
npm run storybook
```

Opens on [http://localhost:6006](http://localhost:6006) with stories for `EztrakTabs`, `CustomPagination`, `ResetColumnsButton`, `CustomCellEditor`, and `Loader`.

## Exports

| Subpath | Description |
| --- | --- |
| `@eztrak/shared` | Main entry — re-exports utils, hooks, and components |
| `@eztrak/shared/utils` | `cn`, `handleApiError`, `confirmationAlert`, `ConfirmationAlertOptions`, `getItem`, `setItem`, `loadUserState`, `saveUserState`, date/format helpers, API error helpers, form field helpers |
| `@eztrak/shared/hooks` | `usePaginationUrlSync`, `useGridHeight` |
| `@eztrak/shared/components` | `EztrakTabs`, `CustomPagination`, `CustomCellEditor`, `SearchInput`, `ResetFiltersButton`, `TooltipText`, `ToolTip`, `CardSkeleton`, `Modal`, `Loader`, `TableLayoutToolbarControls`, `ResetColumnsButton`, and related types |
| `@eztrak/shared/components/tabs.css` | Default tab styles (CSS variables) |
| `@eztrak/shared/components/loader.css` | Loader spinner styles |

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

### CustomCellEditor props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number \| null` | required | Initial cell value (AG Grid passes via `cellEditorParams`) |
| `name` | `string` | required | Property name sent in save payload as `propertyName` |
| `stopEditing` | `() => void` | required | AG Grid callback to close the editor |
| `entityId` | `string \| number` | required | Entity id sent in save payload |
| `entityName` | `string` | `"Record"` | Entity type name sent in save payload |
| `inputType` | `CellEditorInputType` | `"text"` | `text`, `number`, `date`, or `dropdown` |
| `onSave` | `(payload: CellEditPayload) => Promise<void>` | required | Async save handler; throw on failure to show error toast |
| `dropdownOptions` | `DropdownOption[]` | `[]` | Options when `inputType` is `dropdown` |

`CellEditPayload` shape: `{ propertyName, propertyValue, entityId, entityName }`. For `inputType: "number"`, `propertyValue` is a `number` (via `parseFloat`).

## Requirements

- Node.js 18+
- React 18+ (for hooks and components)
- `react-router-dom` — `CustomPagination`, `SearchInput`, `ResetFiltersButton`, and `usePaginationUrlSync` (optional peer; install if you use these)
- `react-hot-toast` — toast feedback in `CustomCellEditor` and `handleApiError`
- `sweetalert2` — `ResetColumnsButton` and `confirmationAlert`
- `react-icons` — `CustomCellEditor`, `SearchInput`, and `Modal`
- `react-tooltip` — `ToolTip` and `TooltipText`
- `framer-motion` — `Modal`
- Works with any bundler that supports the [Node.js `exports` field](https://nodejs.org/api/packages.html#exports)

## License

ISC
