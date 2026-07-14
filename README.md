# Artifacta - Digital Museum Website

A modern digital museum experience showcasing cultural artifacts with rich multimedia content, migration stories, and interactive animations. Built with Next.js 16, Tailwind CSS, and GSAP.

**Tagline:** "Objects, Voices and Global Journeys"

## 🌟 Project Overview

Artifacta is a digital museum platform that presents cultural artifacts through:

- **Landing Page** - Immersive introduction with smooth animations
- **List Page** - Browseable gallery with category filtering and multiple view modes
- **Detail Page** - Rich artifact presentations with audio, PDFs, migration journeys, and contributor stories

The application focuses on the migration narratives behind cultural objects, featuring:

- 12 curated artifacts from diverse cultures
- 7 categories: Architectural, Ceremonial, Decorative, Musical, Playful, Useable, Wearable
- Migration journey visualizations showing artifact movement across countries
- Contributor stories and quotes
- Dark/light theme switching with accessibility controls

## 🛠 Tech Stack

- **Framework:** Next.js 16.2.10 (App Router)
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP with ScrollTrigger
- **Language:** TypeScript 5
- **Package Manager:** pnpm
- **Code Quality:** ESLint 9, Prettier 3.9
- **Fonts:** Google Fonts (Patua One, Playfair Display)

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** >= 20.x
- **pnpm** >= 8.x (recommended package manager)
- **Git** (for version control)

## 🚀 Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd digital-museum
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```
   The application will be available at [http://localhost:8084](http://localhost:8084)

## 🎯 Available Scripts

```bash
# Development
pnpm dev              # Start development server on port 8084
pnpm dev:turbo        # Start with Turbopack for faster builds

# Building
pnpm build            # Build for production (runs lint first)
pnpm start            # Start production server on port 8084

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues automatically
pnpm lint:next        # Run Next.js specific linting

pnpm format           # Check code formatting with Prettier
pnpm format:fix       # Fix formatting issues automatically

# Type Checking
pnpm ts:check         # Run TypeScript type checking
pnpm ts:watch         # Watch mode for type checking

# All Checks
pnpm check            # Run lint, type check, and format check
```

## 📁 Project Structure

```
digital-museum/
├── src/
│   ├── app/                     # Next.js App Router — routing + page-specific components
│   │   ├── layout.tsx           # Root layout (fonts, metadata, theme providers)
│   │   ├── page.tsx             # `/` route
│   │   ├── fonts.ts             # next/font/google definitions (Patua One, Playfair Display)
│   │   ├── landing/             # Landing page route segment
│   │   │   └── components/      # Landing-only components, colocated (not routable)
│   │   ├── list/                # List/gallery page route segment
│   │   │   └── components/      # List-only components, colocated (not routable)
│   │   ├── detail/              # Artifact detail page route segment
│   │   │   └── components/      # Detail-only components, colocated (not routable)
│   │   └── gsap-demo/           # GSAP + ScrollTrigger setup smoke-test route
│   │       └── components/      # e.g. gsap-scroll-demo, colocated (demo-only)
│   ├── components/              # Components shared across more than one page
│   │   ├── layout/               # Shared chrome — SiteHeader, SiteFooter
│   │   └── ui/                   # Shared, page-agnostic primitives — icons.tsx
│   ├── data/                    # Mock data — `mock-data.ts`: 12 artifacts
│   ├── lib/                     # Shared utilities: gsap-utils.ts, utils.ts, data-utils.ts, theme-script.ts
│   └── types/                   # Shared TypeScript interfaces — artifact.ts, theme.ts
├── public/                      # Static assets, organized by type
│   ├── images/                  # Photography/artwork (artifact imagery)
│   └── assets/                  # Icons and other non-photographic static assets
├── docs/                        # Additional documentation (e.g. GSAP performance guide)
├── .github/                     # GitHub workflows and configurations
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── eslint.config.mjs            # ESLint configuration
├── prettier.config.mjs          # Prettier configuration
└── postcss.config.mjs           # PostCSS configuration
```

### Conventions

- **Page-specific components are colocated in `app/`.** Each route segment that needs its own components gets a `components/` subfolder next to its `page.tsx`. A bare `components` folder has no special Next.js filename inside it, so it's never routable — it's purely an implementation detail of that route.
- **`src/components` is reserved for components shared across more than one page** — the site-wide chrome (`layout/`) and generic, page-agnostic UI primitives (`ui/`). If a component is only ever used by one page, it belongs under that page's `app/<route>/components/`, not here.
- Multi-file components use a folder with an `index.tsx` (see `app/gsap-demo/components/gsap-scroll-demo` for the pattern) plus a co-located CSS module when custom styles are needed.
- **`data/` vs `lib/`:** `data/` holds the static mock content itself (e.g. `mock-data.ts`); `lib/` holds the utilities that operate on it (e.g. `data-utils.ts`) alongside other shared helpers.
- **`types/`** holds shared interfaces consumed across pages/components (e.g. `Artifact`). Component-local prop types stay next to the component.
- **`public/`** is split by asset type: `images/` for photographic/artifact media, `assets/` for icons and other static files. Reference them with an absolute path from the public root (e.g. `/assets/vercel.svg`).

## 🎨 Design System

### Color Palette

- **Primary:** Dark navy background (`#1a2744` range)
- **Secondary:** Cream/off-white foreground
- **Accents:** Warm tones from artifact photography
- **Theme:** Dark/light mode support with class-based switching

### Typography

- **Display/Headings:** Patua One (Google Fonts)
- **Body/Serif:** Playfair Display (Google Fonts)
- **Font Utilities:** `font-display`, `font-serif` in Tailwind

## 🔧 Configuration Files

- **next.config.ts** - Next.js configuration
- **tsconfig.json** - TypeScript configuration with path aliases (`@/*` → `./src/*`)
- **src/app/globals.css** - Tailwind v4 theme config (`@theme inline { ... }`); this project has no `tailwind.config.js`
- **eslint.config.mjs** - ESLint rules (Next.js + TypeScript)
- **prettier.config.mjs** - Prettier formatting rules
- **postcss.config.mjs** - PostCSS configuration for Tailwind

## 📊 Data Model

Artifacts follow this TypeScript interface (`src/types/artifact.ts`):

```typescript
interface Artifact {
  id: string
  title: string
  type:
    'Architectural' | 'Ceremonial' | 'Decorative' | 'Musical' | 'Playful' | 'Useable' | 'Wearable'
  thumbnail: string
  media: string[]
  description: string
  contributor?: {
    name: string
    quote: string
    story?: string
  }
  audioUrl: string | null
  audioDurationSeconds?: number
  pdfUrl: string | null
  journey?: {
    country: string
    flag: string
  }[]
}
```

- **`src/data/mock-data.ts`** exports `mockArtifacts`: all 12 artifacts, covering all 7 categories.
- **`src/lib/data-utils.ts`** exposes the functions pages/components should use instead of importing `mockArtifacts` directly (`getAllArtifacts`, `getArtifactById`, `getArtifactsByType`, `getArtifactCategories`, `getNextArtifact`).

## 🎬 Animation Strategy

- **GSAP Core** for timeline-based animations, **ScrollTrigger** for scroll-based animations.
- **Setup:** `gsap`, `ScrollTrigger`, and the `useGSAP` hook (`@gsap/react`) are registered once in `src/lib/gsap-utils.ts` — always import them from there, not directly from `gsap`/`@gsap/react`.
- **`useScrollReveal`** and **`useExitFadeNavigation`** (`src/lib/gsap-utils.ts`) are the shared hooks for scroll-in reveals and click-triggered exit transitions before navigation.
- **Reference:** See [`docs/gsap-performance.md`](./docs/gsap-performance.md) for the full performance/usage guide, and visit `/gsap-demo` in dev for a working ScrollTrigger example.

## ⚠️ Known Issues & Limitations

- **Epic 5 (Details Page) is stretch scope and only partially built.** Layout, media carousel, audio controls, and zoom controls are done; PDF download, comment affordance, migration journey widget, and a dedicated responsive polish pass remain outstanding.
- **Every mock artifact's `audioUrl` is unbacked by a real audio file** — playback is handled gracefully (no crash), but nothing actually plays.
- **No CMS/backend, by design** — content is static and mock-data-driven (`src/data/mock-data.ts`), so content changes require a code change.
- **No automated test suite is configured.** Correctness is verified via `pnpm lint` / `pnpm ts:check` / `pnpm build` plus manual testing.

## 🧪 Development Workflow

1. **Feature Development:** Create components in appropriate directories
2. **Type Safety:** Run `pnpm ts:check` during development
3. **Code Quality:** Run `pnpm lint` and `pnpm format` before commits
4. **Testing:** Use `pnpm check` to run all quality checks
5. **Building:** Test production builds with `pnpm build`

## 📚 Documentation

- **[docs/gsap-performance.md](./docs/gsap-performance.md)** - GSAP setup, context management, and performance guidelines
- **[Next.js Docs](https://nextjs.org/docs)** - Framework documentation
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Styling documentation
- **[GSAP Docs](https://greensock.com/docs/)** - Animation documentation


---
