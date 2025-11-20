# Dev Tools

Dev Tools is a single-page React app that bundles everyday utilities like JSON/XML/SQL formatting, encoding helpers, and timezone conversion into one fast, minimal interface.

## Available tools
- **JSON formatter**: validate and pretty-print JSON with error feedback.
- **XML formatter**: normalize indentation for XML payloads.
- **SQL beautifier**: space and line break common keywords for readability.
- **Encoders & decoders**: Base64 and URL encode/decode helpers.
- **Timezone converter**: preview how timestamps look across popular timezones.

## Development

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- git (for cloning the repository)

### Setup
1. Clone the repository: `git clone <repo-url> && cd dev-tools`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
   - Vite prints a local URL; open it in your browser to view the app.
4. Build for production: `npm run build`
5. Preview the production build locally (optional): `npm run preview`

> Note: Network installs may be required to fetch npm dependencies.
