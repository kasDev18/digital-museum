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
│   │   ├── landing/             # Landing page route segment (Epic 2)
│   │   │   └── components/      # Landing-only components, colocated (not routable)
│   │   ├── list/                # List/gallery page route segment (Epic 3/4)
│   │   │   └── components/      # List-only components, colocated (not routable)
│   │   ├── detail/              # Artifact detail page route segment (Epic 5)
│   │   │   └── components/      # Detail-only components, colocated (not routable)
│   │   └── gsap-demo/           # GSAP + ScrollTrigger setup smoke-test route
│   │       └── components/      # e.g. gsap-scroll-demo, colocated (demo-only)
│   ├── components/              # Components shared across more than one page
│   │   ├── layout/               # Shared chrome (SiteHeader, SiteFooter — Story 1.7)
│   │   └── ui/                   # Shared, page-agnostic primitives (buttons, icons, etc.)
│   ├── data/                    # Mock data (e.g. `mock-data.ts` — Story 1.5)
│   ├── lib/                     # Shared utilities: gsap-utils.ts, utils.ts, data-utils.ts (Story 1.5)
│   └── types/                   # Shared TypeScript interfaces (e.g. `artifact.ts` — Story 1.5)
├── public/                      # Static assets, organized by type
│   ├── images/                  # Photography/artwork (artifact imagery — Story 1.5+)
│   └── assets/                  # Icons and other non-photographic static assets
├── docs/                        # Additional documentation (e.g. GSAP performance guide)
├── .github/                     # GitHub workflows and configurations
├── AGENTS.md                    # AI agent guidelines
├── EPICS_AND_STORIES.md         # Detailed project specifications
├── CLAUDE.md                    # Claude-specific rules
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── eslint.config.mjs            # ESLint configuration
├── prettier.config.mjs          # Prettier configuration
└── postcss.config.mjs           # PostCSS configuration
```

### Conventions

- **Page-specific components are colocated in `app/`.** Each route segment that needs its own components gets a `components/` subfolder next to its `page.tsx` (e.g. `app/landing/components/`, `app/gsap-demo/components/gsap-scroll-demo/`). A bare `components` folder has no special Next.js filename inside it, so it's never routable — it's purely an implementation detail of that route.
- **`src/components` is reserved for components shared across more than one page** — the site-wide chrome (`layout/`, e.g. `SiteHeader`/`SiteFooter` from Story 1.7) and generic, page-agnostic UI primitives (`ui/`, e.g. buttons, form controls). If a component is only ever used by one page, it belongs under that page's `app/<route>/components/`, not here.
- Multi-file components use a folder with an `index.tsx` (see `app/gsap-demo/components/gsap-scroll-demo` for the pattern) plus a co-located CSS module when custom styles are needed.
- **`data/` vs `lib/`:** `data/` holds the static mock content itself (e.g. `mock-data.ts`); `lib/` holds the utilities that operate on it (e.g. `data-utils.ts`) alongside other shared helpers (`gsap-utils.ts`, `utils.ts`).
- **`types/`** holds shared interfaces consumed across pages/components (e.g. `Artifact`). Component-local prop types stay next to the component.
- **`public/`** is split by asset type: `images/` for photographic/artifact media, `assets/` for icons and other static files. Reference them with an absolute path from the public root (e.g. `/assets/vercel.svg`).
- Currently-empty directories are kept in version control with a `.gitkeep` placeholder until their first real file lands in a later story.

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

### Component Architecture
- Shared header/footer chrome with logo and theme controls
- Reusable UI components in `/components/ui`
- Feature-specific components organized by page
- GSAP animation utilities for scroll-based effects

## 🔧 Configuration Files

- **next.config.ts** - Next.js configuration
- **tsconfig.json** - TypeScript configuration with path aliases (`@/*` → `./src/*`)
- **src/app/globals.css** - Tailwind v4 theme config (`@theme inline { ... }`); this project has no `tailwind.config.js` — see [Story 1.2's implementation note](./_bmad-output/implementation-artifacts/story-1-2-configure-tailwind-css.md#implementation-note-no-tailwindconfigjs)
- **eslint.config.mjs** - ESLint rules (Next.js + TypeScript)
- **prettier.config.mjs** - Prettier formatting rules
- **postcss.config.mjs** - PostCSS configuration for Tailwind

## 📊 Data Model

Artifacts follow this TypeScript interface:

```typescript
interface Artifact {
  id: string;
  title: string;
  type: 'Architectural' | 'Ceremonial' | 'Decorative' | 'Musical' | 'Playful' | 'Useable' | 'Wearable';
  thumbnail: string;
  media: string[];
  description: string;
  contributor?: {
    name: string;
    quote: string;
    story?: string;
  };
  audioUrl?: string | null;
  audioDurationSeconds?: number;
  pdfUrl?: string | null;
  journey?: {
    country: string;
    flag: string;
  }[];
}
```

## 🎬 Animation Strategy

- **GSAP Core:** For timeline-based animations
- **ScrollTrigger:** For scroll-based animations
- **Performance:** GPU acceleration with `will-change` and transforms
- **Cleanup:** Proper GSAP context management for component unmounting
- **Setup:** `gsap`, `ScrollTrigger`, and the `useGSAP` hook (`@gsap/react`) are registered once in `src/lib/gsap-utils.ts` — always import them from there, not directly from `gsap`/`@gsap/react`
- **Reference:** See [`docs/gsap-performance.md`](./docs/gsap-performance.md) for the full performance/usage guide, and visit `/gsap-demo` in dev for a working ScrollTrigger example (`src/components/gsap-scroll-demo/index.tsx`)

## 🧪 Development Workflow

1. **Feature Development:** Create components in appropriate directories
2. **Type Safety:** Run `pnpm ts:check` during development
3. **Code Quality:** Run `pnpm lint` and `pnpm format` before commits
4. **Testing:** Use `pnpm check` to run all quality checks
5. **Building:** Test production builds with `pnpm build`

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js
3. Configure build settings:
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

### Other Platforms
Ensure the platform supports:
- Node.js 20+
- pnpm or convert to npm/yarn
- Static site generation or server-side rendering

## 📚 Documentation

- **[EPICS_AND_STORIES.md](./EPICS_AND_STORIES.md)** - Detailed project specifications and user stories
- **[AGENTS.md](./AGENTS.md)** - AI agent development guidelines
- **[docs/gsap-performance.md](./docs/gsap-performance.md)** - GSAP setup, context management, and performance guidelines
- **[Next.js Docs](https://nextjs.org/docs)** - Framework documentation
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Styling documentation
- **[GSAP Docs](https://greensock.com/docs/)** - Animation documentation

## 🤝 Contributing

1. Follow the existing code structure and conventions
2. Run `pnpm check` before committing
3. Use TypeScript for all new code
4. Follow the component architecture patterns
5. Test animations for performance

## 📝 License

[Specify your license here]

## 🎯 Project Status

- **Current Phase:** Development
- **Deadline:** July 15, 2026
- **Priority:** Landing Page & List Page (Required), Details Page (Optional/Stretch)
- **Branch:** `docs/add-bmad-stories`

---

**Built with ❤️ using Next.js, Tailwind CSS, and GSAP**
