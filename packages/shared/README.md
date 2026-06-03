# @eztrak/shared

Shared utilities, hooks, and UI components for Eztrak applications.

## Install

```bash
npm install @eztrak/shared
```

Peer dependencies for hooks:

```bash
npm install react react-dom react-router-dom
```

## Usage

### Utils

```js
import { cn, formatDate, getApiError, isEmpty } from "@eztrak/shared/utils";

<div className={cn("px-4 py-2", isActive && "bg-blue-500", className)} />
```

`cn` combines [`clsx`](https://github.com/lukeed/clsx) with [`tailwind-merge`](https://github.com/dcastil/tailwind-merge).

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
| `@eztrak/shared/utils` | `cn`, date/format helpers, API error helpers, form field helpers |
| `@eztrak/shared/hooks` | `usePaginationUrlSync`, `useGridHeight` |

## Requirements

- Node.js 18+
- React 18+ (for hooks)
- Works with any bundler that supports the [Node.js `exports` field](https://nodejs.org/api/packages.html#exports)

## License

ISC
