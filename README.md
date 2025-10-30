# fav-media-frontend

Frontend for "Favorite Movies & TV Shows" — a Vite + React + TypeScript app using Ant Design and Tailwind.

## Quick start

Requirements:

- Node.js 18+ (or compatible)
- npm

Install and run locally:

```bash
npm ci
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
# or serve built output
npm run serve
```

Key npm scripts (package.json):

- dev — vite dev server
- build — `tsc -b && vite build`
- vercel-build — same as build (used by Vercel)
- preview — vite preview
- serve — serve dist (optional)

## Project structure

- src/
  - api.ts
  - main.tsx
  - App.tsx
  - components/
    - entriesTable.tsx
    - entryForm.tsx
  - hooks/
    - useInfiniteScroll.ts
  - styles: input.css, index.css, output.css
- vite.config.ts
- tsconfig.node.json
- vercel.json

## Vercel deployment

Recommended Vercel project settings (Import → Configure Project):

- Root Directory: (leave blank) or `.`
- Install Command: `npm ci`
- Build Command: `npm run vercel-build` (fallback: `npm run build` or `vite build`)
- Output Directory: `dist`

vercel.json is included and rewrites all routes to index.html for SPA routing.

CLI deploy:

```powershell
npm i -g vercel
vercel login
vercel --prod
```

Note: If `tsc -b` fails on Vercel, change Build Command to `vite build` until TS issues are resolved.

## CORS / Backend note

If you see this in browser console:
`Access-Control-Allow-Origin: http://localhost:5173` but your site origin is `your -frontend-url` — the backend only allows localhost, so the browser blocks requests.

Fix (recommended): update backend CORS to include your production origin. Example (Express):

```javascript
// add to backend
import cors from "cors";
const allowed = ["http://localhost:5173", "your-frontend-url"];
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
    credentials: true,
  })
);
```

Or for FastAPI:

```python
from starlette.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173","your-frontend-url"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)
```

Dev proxy (local only) — add to vite.config.ts to avoid CORS during development:

```js
server: {
  proxy: {
    '/api': {
      target: 'your-backend-url',
      changeOrigin: true,
      secure: true
    }
  }
}
```

## Bundle size / Ant Design chunking

Large `antd` chunk observed. Two options:

- Split antd into per-component chunks via rollup manualChunks.
- Lazy-load heavy screens with React.lazy/Suspense.

Suggested manualChunks (apply to vite.config.ts) to break antd into smaller pieces:

```typescript
// filepath:
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // ...existing code...
  build: {
    // ...existing build settings...
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id) return;
          if (id.includes("node_modules/antd/")) {
            const m = id.match(/node_modules\/antd\/(?:es|lib)\/([^/]+)/);
            return m ? `antd-${m[1]}` : "antd";
          }
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
```
