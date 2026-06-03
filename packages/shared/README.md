# @eztrak/shared

Shared utilities, hooks, and UI components for Eztrak applications.

## Install

```bash
npm install @eztrak/shared
```

Peer dependencies (hooks + `handleApiError`):

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

### Root import

```js
import { cn, useGridHeight } from "@eztrak/shared";
```

## Exports

| Subpath | Description |
| --- | --- |
| `@eztrak/shared` | Main entry — re-exports utils and hooks |
| `@eztrak/shared/utils` | `cn`, `handleApiError`, date/format helpers, API error helpers, form field helpers |
| `@eztrak/shared/hooks` | `usePaginationUrlSync`, `useGridHeight` |

## Requirements

- Node.js 18+
- React 18+ (for hooks)
- Works with any bundler that supports the [Node.js `exports` field](https://nodejs.org/api/packages.html#exports)

## License

ISC
