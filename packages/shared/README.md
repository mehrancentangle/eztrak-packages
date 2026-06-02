# @eztrak/shared

Shared utilities, hooks, and UI components for Eztrak applications.

## Install

```bash
npm install @eztrak/shared
```

## Usage

### `cn` — class name helper

Merge conditional class names and resolve conflicting Tailwind CSS utilities:

```js
import { cn } from "@eztrak/shared/utils";

<div className={cn("px-4 py-2", isActive && "bg-blue-500", className)} />
```

You can also import from the package root:

```js
import { cn } from "@eztrak/shared";
```

`cn` combines [`clsx`](https://github.com/lukeed/clsx) with [`tailwind-merge`](https://github.com/dcastil/tailwind-merge).

## Exports

| Subpath | Description |
| --- | --- |
| `@eztrak/shared` | Main entry — re-exports available utilities |
| `@eztrak/shared/utils` | Utility functions (`cn`, and more over time) |

Additional subpath exports (`/hooks`, `/ui`, etc.) will be added in future releases.

## Requirements

- Node.js 18+
- Works with any bundler that supports the [Node.js `exports` field](https://nodejs.org/api/packages.html#exports)

## License

ISC
