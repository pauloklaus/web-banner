# WebBanner

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live demo](https://img.shields.io/badge/demo-banner.dataplain.com.br-4a9eff.svg)](https://banner.dataplain.com.br)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)

Open-source Vue 3 SPA that displays a continuously scrolling horizontal message, ideal for use as a banner on screens or mobile devices.

**Live demo:** [banner.dataplain.com.br](https://banner.dataplain.com.br)

Repository: [github.com/pauloklaus/web-banner](https://github.com/pauloklaus/web-banner)

## Goal

Let users configure a message, colors, and scroll speed, preview it fullscreen, and share the setup via URL. The app can be installed on Android as a PWA.

## Features

- **Edit mode:** message (up to 100 characters), background color, text color, speed (x1, x2, x4)
- **Play mode:** fullscreen text, right-to-left scrolling, tap to pause/resume
- **Sharing:** Share button in edit and play modes (WhatsApp on mobile, copy link on desktop)
- **Shareable URL:** settings as readable query parameters (`m`, `b`, `f`, `s`, `p`); defaults omitted
- **PWA:** installable on Android via Chrome

## Stack

- Vue 3 (`<script setup lang="ts">`)
- TypeScript
- Vite 6
- vite-plugin-pwa
- Cloudflare Pages

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (for `make dev` and `make build`)

Alternatively, Node.js 24+ and npm if you prefer to run without Docker.

## Development

Clone the repository and, from the project root:

```bash
git clone https://github.com/pauloklaus/web-banner.git
cd web-banner
make dev
```

This starts an ephemeral Node 24 container, installs dependencies, and runs Vite at `http://localhost:5173`.

Press `Ctrl+C` in the terminal to stop.

### Environment variables (optional)

Copy the example file and set your repository URL:

```bash
cp .env.example .env
```

| Variable               | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `VITE_APP_NAME`        | App name shown in the UI, document title, and PWA manifest |
| `VITE_GITHUB_REPO_URL` | Repository URL linked from the footer                      |
| `VITE_SITE_URL`        | Canonical site URL (Open Graph and meta tags)              |

Restart the dev server after changing `.env`.

### Without Docker

```bash
npm install
npm run dev
```

## Production build

```bash
make build
```

Output is written to `dist/`.

### Typecheck

```bash
make typecheck
```

Runs `vue-tsc --noEmit` (also included in `make build` and `npm run build`).

### Unit tests

```bash
make test
```

Runs Vitest once (`vitest run`). For watch mode without Docker:

```bash
npm run test:watch
```

Coverage report (terminal + `coverage/` HTML). Fails if global coverage drops below **80%** (lines, branches, functions, statements):

```bash
make coverage
```

Tests live next to the modules they cover (`src/utils/*.test.ts`).

The project is deployed to Cloudflare Pages at [banner.dataplain.com.br](https://banner.dataplain.com.br).

| Setting                | Value                      |
| ---------------------- | -------------------------- |
| Build command          | `npm run build`            |
| Build output directory | `dist`                     |
| Node.js version        | `24` (see `.node-version`) |

SPA routing is handled by `public/_redirects` (`/* → /index.html`).

Connect the GitHub repository in the Cloudflare Pages dashboard and use the settings above. Builds and deploys run on Cloudflare — no GitHub Actions required.

## Icons

PNG icons are generated from `public/icons/icon.svg`:

```bash
make icons
```

Or without Docker:

```bash
npm run generate:icons
```

This creates `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-light.svg`, `favicon-dark.svg`, matching PNG fallbacks, and localized Open Graph images (`og-image-en.png`, `og-image-pt.png`, `og-image-es.png`).

Favicons use separate light/dark assets selected via `<link media="(prefers-color-scheme: ...)">`: dark badge on light tabs, white rounded badge on dark tabs.

## Internationalization

Supported languages: **English** (fallback), **Portuguese (Brazil)**, and **Spanish**.

The UI language is detected from the browser (`navigator.languages`). Meta tags and the Open Graph image are updated at runtime to match the active locale.

> **Note:** Social crawlers (e.g. WhatsApp link preview) read static HTML and typically show the English Open Graph defaults. In-app sharing uses the live URL; preview language may still be English unless server-side locale detection is added later.

## Configuration URL

Settings are stored as query parameters. Default values are omitted.

```
https://banner.dataplain.com.br/?m=Hello&b=%23f00&f=white&s=2&p=1
```

| Param | Meaning                             | Default           |
| ----- | ----------------------------------- | ----------------- |
| `m`   | Message (max. 100 characters)       | _(empty)_         |
| `b`   | Background color                    | `#000000` (black) |
| `f`   | Text (foreground) color             | `#ffffff` (white) |
| `s`   | Scroll speed (`1`, `2`, or `4`)     | `1`               |
| `p`   | Auto-start in play mode (`1` = yes) | off               |

Colors accept hex (`#f00`, `#ff0000`) or CSS names (`white`, `red`). Invalid values fall back to defaults.

## Android installation

1. Open the app in Chrome (HTTPS or localhost)
2. Tap **Install** (when available) or use Chrome menu → **Install app**

## Project structure

```
src/
├── App.vue                 # Global state and mode switching
├── main.ts                 # App bootstrap
├── components/             # Vue SFCs + barrel (index.ts)
├── composables/            # Reusable logic (URL, scroll, PWA, meta)
├── config/                 # Env reader (readEnv.ts)
├── constants/              # Shared constants (defaults, limits, i18n locale)
├── i18n/                   # vue-i18n setup and locales
├── types/                  # Shared TypeScript types
├── test/                   # Test helpers (e.g. createAppState)
└── utils/                  # Pure helpers (text, URL config, colors)
```

See [doc/CODE_GUIDE.md](doc/CODE_GUIDE.md) for coding conventions.

## Contributing

Contributions are welcome! Read [doc/CODE_GUIDE.md](doc/CODE_GUIDE.md) before submitting changes.

- **Language:** English for documentation, commit messages, issues, and pull requests.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, …) — details in the [code guide](doc/CODE_GUIDE.md#commits).

Open an [issue](https://github.com/pauloklaus/web-banner/issues) to report bugs or suggest improvements, or submit a pull request.

## License

This project is open source under the [MIT](LICENSE) license.
