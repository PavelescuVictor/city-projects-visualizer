# Project Coding Rules

These rules apply to the whole repository.

## Naming

- Write constant names as uppercase words separated by underscores, such as `PROJECT_STATUSES`.

## React Components

- Write React components as functional arrow components.
- Type component props explicitly.
- Accept a single `props` parameter and destructure it inside the function body.
- Export each component from its `ComponentName.tsx` file as `export default ComponentName` at the end of the file on a separate line.
- Keep component prop types in a colocated `ComponentName.types.ts` file.
- Keep component styles in a colocated `ComponentName.css` file and import it from `ComponentName.tsx`.

## Component Exports

- Component folder `index.ts` files should export the default component as both the named component and default export, plus component-local helpers and colocated prop types.
- The root `src/components/index.ts` barrel should export components only.

## Component Placement

- Before adding a new generic-looking component, ask whether it should live in `src/components/basic/`.
- Put confirmed generic/basic components in `src/components/basic/ComponentName/`.
- Keep feature-specific components close to where they live or are first used; if a component is only used by one component, place it inside that component's folder.
- Elevate a feature-specific component only when it becomes shared, and ask before moving it.

## CSS

- Prefer native CSS nesting with explicit `&` syntax, such as `& .child-class`, for component-scoped nested rules when it improves readability.

## Development Servers

- Before starting a dev server, check whether this project already has a running dev server.
- Do not let Vite silently increment ports across multiple runs.
- Prefer `127.0.0.1:5173` for the development server unless the user explicitly asks for another port.
- If `5173` is occupied by a stale server for this project, stop that server before starting a new one.
- If another unrelated process owns `5173`, ask before choosing a different port.
- When starting a server, report the final URL and keep track of any process that should be stopped later.
