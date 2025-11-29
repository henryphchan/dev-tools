# Dev Tools

Demo: https://devtools.henrychan.tech/ (hosted by GitHub Pages)

A sleek developer-first utility belt inspired by smallapp.dev. This Next.js App Router experience ships JSON/XML/SQL formatters, encoders/decoders, a timezone converter, and a bitwise calculator with a Tailwind CSS-driven UI that feels at home in dark mode. Each tool now has an SEO-friendly URL so you can bookmark or share deep links.

## Tech stack
- Next.js 14 (App Router)
- React 18
- Tailwind CSS

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.
3. Lint the project:
   ```bash
   npm run lint
   ```

## Deploying to Static Web Apps
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Publish the `.next` output through your Static Web Apps workflow. Use `npm run build` as the build command and `.` as the app location so Next.js can prerender the SPA shell.

## Features
- SEO-ready landing page with descriptive copy for indexing
- JSON, XML, and SQL formatters with copy-friendly outputs
- URL/Base64 encoders & decoders
- Timezone conversion powered by Luxon
- Bitwise operations with binary previews
- Dedicated tool routes for sharing and documentation

Contributions and additional tools are welcome!

## Adding a new tool
1. **Create a metadata definition** in `lib/tools/definitions/`.
   - Copy an existing file (for example `json-formatter.ts`) and export a `ToolInfo` object.
   - Set a unique `id` (used internally) and `slug` (used for the URL at `/tools/[slug]`).
   - Populate titles, descriptions, accent colors, badge text, and SEO keywords using the fields defined in `lib/tools/types.ts`.
   - The registry auto-loads every definition in this folder, so no central list needs to be edited.
2. **Add a dedicated workspace (optional but recommended)** in `components/workspaces/` when the tool’s UI or logic differs from the legacy workspace.
   - Export a component that accepts `{ tool: ToolInfo }` props. See `UuidWorkspace.tsx` or `BitwiseWorkspace.tsx` for patterns.
   - Register the component in `components/ToolWorkspace.tsx` by mapping the tool `id` to your workspace in `workspaceRegistry`. Tools not listed here automatically fall back to `LegacyToolWorkspace`.
3. **Verify the experience** by running `npm run lint` and loading the tool at `/tools/[slug]`.

## Tool architecture
- **Metadata registry:** Every tool advertises its title, descriptions, colors, and SEO keywords via a standalone definition file in `lib/tools/definitions/`. Drop in a new `.ts` file exporting a `ToolInfo` object to register a tool without touching a central list.
- **Workspace logic:** `components/ToolWorkspace.tsx` now routes tool IDs to dedicated workspace components under `components/workspaces/`. New or refactored tool logic can live in its own `.tsx` file (for example, the UUID and bitwise tools) while the legacy workspace remains available as a fallback for tools that have not been migrated yet.
- **Routing:** `app/tools/[slug]/page.tsx` uses the registry to generate static params and to select the matching tool for the workspace render, keeping URLs stable while allowing the registry to grow automatically.
