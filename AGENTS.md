# Project Coding Rules

These rules apply to the whole repository.

## React Components

- Write React components as functional arrow components.
- Type component props explicitly.
- Accept a single `props` parameter and destructure it inside the function body.
- Export components at the end of the file on a separate line.
- Keep component prop types in a colocated `ComponentName.types.ts` file.
- Keep component styles in a colocated `ComponentName.css` file and import it from `ComponentName.tsx`.

## Component Exports

- Component folder `index.ts` files should export the component, optional default component export, component-local helpers, and colocated prop types.
- The root `src/components/index.ts` barrel should export components only.

## Development Servers

- Before starting a dev server, check whether this project already has a running dev server.
- Do not let Vite silently increment ports across multiple runs.
- Prefer `127.0.0.1:5173` for the development server unless the user explicitly asks for another port.
- If `5173` is occupied by a stale server for this project, stop that server before starting a new one.
- If another unrelated process owns `5173`, ask before choosing a different port.
- When starting a server, report the final URL and keep track of any process that should be stopped later.
