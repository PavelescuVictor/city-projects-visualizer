# city-projects-visualizer

An interactive city development map for publishing and reviewing local projects such as buildings, parks, bridges, streets, public realm upgrades, and other urban interventions.

The app is intentionally simple for this version: production is a public read-only Vite site, while project creation and geometry editing stay available only on the local development server. Project data lives in `src/data/projects.json`, so updates can be reviewed, committed, and redeployed without adding a database or authentication layer yet.

## Business Features

- Public city project viewer with an interactive Leaflet map.
- OpenStreetMap base tiles with project-specific marker and parcel overlays.
- Project list with search and status filters.
- Status-based styling for planning, permitting, construction, and delivered projects.
- Focused project panel with address, neighbourhood, type, project website, and attached images.
- Map tooltips with project details and image carousel support.
- Toggleable markers and parcels.
- Reset, zoom, and focus controls for map navigation.
- Local-only project creation with a draft marker and starter parcel triangle.
- Local-only project editing for marker position and parcel polygon vertices.
- Local-only project deletion with confirmation.
- File-based persistence to `src/data/projects.json` through Vite dev middleware.
- Production read-only mode that hides create, edit, delete, save, revert, and geometry controls.

## Tech Stack

- React 18
- TypeScript
- Vite
- Leaflet
- OpenStreetMap tiles
- Static JSON project data
- Vercel static hosting

## Data Model

Projects are stored in `src/data/projects.json` and imported into the app as typed project data. Coordinates and parcel boundaries use GeoJSON-compatible longitude/latitude ordering so the data can later move into an API, GIS workflow, Supabase, or another persistent store.

Typical project fields include:

- `id`
- `name`
- `type`
- `status`
- `neighbourhood`
- `address`
- `coordinates`
- `parcelPolygon`
- `website`
- `images`

## Local Editing

Use Node.js 24. The project includes `.nvmrc`, `.node-version`, and a `package.json` engine declaration so local tooling and Vercel use the same major Node version.

Install dependencies:

```sh
npm install
```

Run the local editable development server:

```sh
npm run dev -- --host 127.0.0.1 --port 5173
```

In development mode, the UI enables project creation, editing, deletion, save, and revert controls. The local Vite middleware exposes `/api/projects` so the app can read from and write to `src/data/projects.json`.

After making local changes in the UI, click `Save changes`. This updates `src/data/projects.json` directly.

## Production Preview

Build the static production app:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview -- --host 127.0.0.1 --port 4173
```

Production mode is read-only. It loads bundled data from `src/data/projects.json` and hides all mutation controls, including create, edit, delete, save, revert, and geometry editing interactions.

## Vercel Deployment

Use these Vercel project settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: `24.x`

The `vercel.json` rewrite serves the Vite single-page app for all routes.

Deploy from the local project with:

```sh
npx vercel@latest --prod
```

## Publishing Workflow

1. Start the local dev server.
2. Create, edit, or delete projects in the UI.
3. Click `Save changes` so `src/data/projects.json` is updated.
4. Run `npm run build` to validate the production bundle.
5. Commit `src/data/projects.json` and any code changes.
6. Push to the Git branch connected to Vercel, or deploy with the Vercel CLI.
7. The public production app serves the latest bundled JSON as a read-only viewer.

## Security Model

This version does not include hosted admin editing, authentication, or a database. That is deliberate:

- Production has no write API.
- Production hides all mutation controls.
- Project updates are made locally and published through deployment.
- `src/data/projects.json` remains the source of truth.

Future hosted editing can add Clerk for authentication and Supabase for project storage, roles, and auditability.
