# eztrak-packages

Monorepo for shared npm packages used across Eztrak applications.

## Packages

| Package | Description |
| --- | --- |
| [`@eztrak/shared`](./packages/shared) | Shared utilities, hooks, and UI components |

Companion design primitives (`Button`, `Card`, `Loader`, etc.) are available separately via [`eztrak-ui`](https://www.npmjs.com/package/eztrak-ui).

## Getting started

Install dependencies and build all packages:

```bash
npm install
npm run build
```

Build a single package:

```bash
npm run build:shared
```

## Documentation

See the README in each package folder for install instructions, usage examples, and API details.

- [@eztrak/shared](./packages/shared/README.md)

## Contributing

1. Fork and clone the repository
2. Create a branch for your change
3. Run `npm install` and `npm run build` to verify the build passes
4. Open a pull request with a clear description of the change

## License

ISC
