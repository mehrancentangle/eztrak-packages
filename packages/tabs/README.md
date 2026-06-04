# @eztrak/tabs

Themeable, accessible tab navigation for Eztrak applications. Ports and improves the elite-pilot `CustomTab` pattern with CSS variables, `classNames` overrides, and WAI-ARIA keyboard support.

## Install

```bash
npm install @eztrak/tabs
```

Peer dependencies:

```bash
npm install react react-dom
```

Import styles once in your app entry or layout:

```ts
import "@eztrak/tabs/styles.css";
```

## Usage

### With panels

```tsx
import { EztrakTabs } from "@eztrak/tabs";
import "@eztrak/tabs/styles.css";

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

### Nav only (content rendered elsewhere)

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

### Controlled with URL (react-router)

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

### Keep heavy panels mounted

```tsx
<EztrakTabs tabs={tabs} activeTab={section} onTabChange={setSection} keepMounted />
```

## Theming

### CSS variables (global rebrand)

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

### Tailwind `classNames` (per slot)

```tsx
<EztrakTabs
  tabs={tabs}
  activeTab={id}
  onTabChange={setId}
  classNames={{
    list: "gap-3",
    button: "rounded-full px-6",
    underline: "h-1 bg-blue-600",
    panel: "mt-6",
  }}
/>
```

## Props

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

### `EztrakTab`

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique tab id |
| `label` | `ReactNode` | Tab label |
| `content` | `ReactNode` | Panel content (when `showPanels` is true) |
| `icon` | `ReactNode` | Optional icon before label |
| `disabled` | `boolean` | Disables tab and skips keyboard focus |

## Keyboard

- **Arrow Left / Right** (or Up / Down): move between enabled tabs
- **Home / End**: first / last enabled tab
- **Tab**: standard focus order

## Requirements

- Node.js 18+
- React 18+
- Bundler that supports the Node.js `exports` field

## License

ISC
