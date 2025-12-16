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

## Deployment
This project includes a GitHub Actions workflow for **GitHub Pages** in `.github/workflows/nextjs.yml`.

To deploy manually or to other static hosts:
1. Build the production bundle:
   ```bash
   npm run build
   ```
   *Note: For static hosting (like GitHub Pages), ensure `output: "export"` is set in `next.config.mjs` to generate an `out` directory.*
2. Publish the output directory (default `.next` for server-based or `out` for static exports).

## Features
- **Converters**: JSON/XML/SQL formatters, URL/Base64, Timezone, String Case, CSV to JSON, YAML to JSON, and more.
- **Generators**: UUID, Hash (MD5/SHA), QR Code, Lorem Ipsum, Password, SVG Placeholder, Color Palette.
- **Analyzers**: CSV/Parquet Profiler, Regex Tester, Text Diff, Privacy-aware EXIF Viewer.
- **Web Tools**: Live Markdown Preview, Keycode Visualizer, WebP Converter.
- **Architecture**: dedicated workspaces for each tool, SEO-friendly URLs, and a clean Tailwind CSS UI.

Contributions and additional tools are welcome!

## Adding a new tool
1. **Create a metadata definition** in `lib/tools.ts`.
   - Add a new `ToolInfo` object to the `tools` array.
   - Define the `id`, `slug`, `title`, `description`, `badge`, `accent`, and `keywords`.
2. **Add a dedicated workspace** in `components/workspaces/`.
   - Create a new component (e.g., `MyNewToolWorkspace.tsx`) that accepts `{ tool: ToolInfo }` props.
   - Implement the tool's UI and logic here.
3. **Register the workspace** in `components/ToolWorkspace.tsx`.
   - Import your new workspace component.
   - Add it to the `workspaceRegistry` object, mapping your tool `id` to the component.
4. **Verify the experience** by running `npm run lint` and loading the tool at `/tools/[slug]`.

## Tool architecture
- **Metadata registry:** All tools are defined in `lib/tools.ts`. This central registry drives the landing page, search, and routing.
- **Workspace logic:** `components/ToolWorkspace.tsx` routes tool IDs to dedicated workspace components. Each tool lives in its own isolated component under `components/workspaces/`, keeping the codebase modular and easy to maintain.
- **Routing:** `app/tools/[slug]/page.tsx` uses the registry to generate static params and select the matching tool for the workspace render.
