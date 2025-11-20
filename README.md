# Dev Tools

A sleek developer-first utility belt inspired by smallapp.dev. This single-page Next.js app ships JSON/XML/SQL formatters, encoders/decoders, a timezone converter, and a bitwise calculator with a Tailwind CSS-driven UI that feels at home in dark mode.

## Tech stack
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Luxon, sql-formatter, xml-formatter for focused tooling

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

## Deploying to Azure Static Web Apps
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Publish the `.next` output through your Static Web Apps workflow. Use `npm run build` as the build command and `.` as the app location so Next.js can prerender the SPA shell.

## Features
- JSON, XML, and SQL formatters with copy-friendly outputs
- URL/Base64 encoders & decoders
- Timezone conversion powered by Luxon
- Bitwise operations with binary previews

Contributions and additional tools are welcome!
