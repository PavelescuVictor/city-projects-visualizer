# Project Coding Rules

These rules apply to the whole repository.

## React Components

- Write React components as functional arrow components.
- Type component props explicitly.
- Accept a single `props` parameter and destructure it inside the function body.
- Export components at the end of the file on a separate line.
- Keep component prop types in a colocated `ComponentName.types.ts` file.
- Keep component styles in a colocated `ComponentName.css` file and import it from `ComponentName.tsx`.
