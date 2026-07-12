# Digital Museum Website - Epics and Stories

**Project:** Digital Museum Website Technical Assessment  
**Brand/Working Title:** "Artifacta" — tagline "Objects, Voices and Global Journeys"  
**Framework:** Next.js (App Router) + Tailwind CSS + GSAP  
**Design Source:** Figma board "Ion Oval Zip Legend" + exported assets in `digital-museum/` (PRD docx, page mocks, icon/asset exports)  
**Deadline:** July 15, 2026  
**Priority:** Landing Page & List Page (Required), Details Page (Optional/Stretch)

**Alignment note:** Stories below have been cross-checked against the actual exported Figma assets (not just the text brief). Several details only became clear from the exports and override earlier generic assumptions:
- Real artifact set is 12 mock items (not a placeholder count): Wooden Chest, Vyshyvanka, Carnival Mask, Beaded Gown, Mshatta Façade, Lei Po'o, Tatreez Thobe, Mbira, Minbar, Bamboo Pen, Backgammon Board, Jamdani.
- Real category set is 7 categories + "All Objects" (not 3-4): Architectural, Ceremonial, Decorative, Musical, Playful, Useable, Wearable.
- The "location widget" asset is **not** a lat/lng map pin — it's a migration-journey strip of country flags connected by arrows (e.g. "From Myanmar → To Sri Lanka → To USA → To Myanmar"), matching the site's migration theme. Data model and Story 5.7 are updated accordingly.
- Fonts are Google Fonts **Patua One** (display/headings) and **Playfair Display** (body/serif).
- Landing CTA copy is literally "Enter Exhibition".
- Every page shares header/footer chrome (logo, "Artifacta" wordmark, footer copyright, social links, and a dark/light theme toggle + font-size A+/A- controls) that wasn't captured as its own story before — added as Story 1.7.

---

## Epic 1: Project Setup
**Goal:** Establish the technical foundation with proper scaffolding, tooling, and project structure for scalable development.

### Story 1.1: Initialize Next.js Project with App Router
**As a** developer  
**I want to** initialize a Next.js project using App Router  
**So that** I have a modern React framework foundation with proper routing structure

**Acceptance Criteria:**
- [ ] Next.js project created using latest stable version
- [ ] App Router structure is used (not Pages Router)
- [ ] Project follows Next.js conventions for app directory structure
- [ ] TypeScript is configured and enabled
- [ ] ESLint and Prettier are configured with appropriate rules
- [ ] Git repository is initialized with appropriate .gitignore

**Technical Notes:**
- Use `npx create-next-app@latest` with TypeScript, ESLint, and Tailwind CSS options
- Ensure app directory structure: `/app`, `/components`, `/public`, `/lib` or `/utils`

---

### Story 1.2: Configure Tailwind CSS
**As a** developer  
**I want to** configure Tailwind CSS with custom design tokens  
**So that** I can efficiently match the Figma design specifications

**Acceptance Criteria:**
- [ ] Tailwind CSS is properly installed and configured
- [ ] Custom colors, fonts, and spacing from Figma are defined in tailwind.config.js
- [ ] Google Fonts **Patua One** (display/headings) and **Playfair Display** (body/serif) are loaded via `next/font/google` and mapped to Tailwind font families
- [ ] Dark navy background / cream foreground palette (per Figma) is defined as Tailwind theme colors, with tokens for a light-theme variant to support the footer's theme toggle
- [ ] Design tokens are extensible for future updates
- [ ] Tailwind directives are properly imported in global CSS
- [ ] PostCSS configuration is set up correctly

**Technical Notes:**
- Extract color palette (dark navy `#1a2744`-range background, cream/off-white text and cards, warm accent tones from artifact photography), typography scale, and spacing system from Figma
- Set up custom theme extension in tailwind.config.js, including a `dark`/`light` theme strategy (class-based) to support the header/footer theme toggle
- Load Patua One and Playfair Display via `next/font/google`, expose as `font-display` / `font-serif` Tailwind utilities

---

### Story 1.3: Install and Configure GSAP
**As a** developer  
**I want to** install GSAP and configure it for scroll-based animations  
**So that** I can implement smooth, performant animations throughout the application

**Acceptance Criteria:**
- [ ] GSAP core and ScrollTrigger plugin are installed
- [ ] GSAP is properly registered for use in components
- [ ] Performance considerations are documented (will-change, transform optimizations)
- [ ] GSAP context management is set up for cleanup
- [ ] Demo animation component confirms proper setup

**Technical Notes:**
- Install `gsap` and `gsap/ScrollTrigger` via npm
- Create a utility hook or component for GSAP context management
- Document best practices for performance (useTransform, GPU acceleration)

---

### Story 1.4: Establish Project Folder Structure
**As a** developer  
**I want to** create a logical, scalable folder structure  
**So that** the codebase remains organized and maintainable as it grows

**Acceptance Criteria:**
- [ ] Component structure: `/components` with subdirectories by feature/page
- [ ] Data layer: `/data` or `/lib` for mock data and data utilities
- [ ] Assets: `/public` folder organized by type (images, fonts, etc.)
- [ ] Utilities: `/lib` or `/utils` for shared helper functions
- [ ] Types: `/types` for TypeScript interfaces and types
- [ ] README documents the folder structure and conventions

**Technical Notes:**
```
/app
  /layout.tsx
  /page.tsx
  /landing
  /list
  /detail
/components
  /landing
  /list
  /detail
  /ui (shared components)
/data
  /mock-data.ts
/lib
  /gsap-utils.ts
  /data-utils.ts
/types
  /artifact.ts
/public
  /images
  /assets
```

---

### Story 1.5: Create Mock Data Layer
**As a** developer  
**I want to** create a JSON-based mock data structure for artifacts  
**So that** content is data-driven and easily maintainable across pages

**Acceptance Criteria:**
- [ ] TypeScript interface defined for Artifact data model
- [ ] Mock data file created with the 12 real artifacts from the Figma board: Wooden Chest, Vyshyvanka, Carnival Mask, Beaded Gown, Mshatta Façade, Lei Po'o, Tatreez Thobe, Mbira, Minbar, Bamboo Pen, Backgammon Board, Jamdani
- [ ] Data includes all required fields: id, title, type, thumbnail, media, description
- [ ] Category (`type`) values are drawn from the real 7-category set: Architectural, Ceremonial, Decorative, Musical, Playful, Useable, Wearable (with "All Objects" handled as a UI-level "no filter" state, not a stored category)
- [ ] Contributor fields included: `contributor.name` and `contributor.quote`, matching the "Contributed by [Name]" byline and pull-quote seen on the detail mock (e.g. Mshatta Façade / Mansoor Alemy)
- [ ] Optional fields included: audioUrl (+ duration), pdfUrl, journey (migration path)
- [ ] Data utility functions for filtering and accessing artifacts
- [ ] Data is easily extensible for additional artifacts

**Technical Notes:**
```typescript
interface Artifact {
  id: string;
  title: string;
  type: 'Architectural' | 'Ceremonial' | 'Decorative' | 'Musical' | 'Playful' | 'Useable' | 'Wearable';
  thumbnail: string; // image path/URL
  media: string[]; // supplementary images cycled via the "More Images" control on the detail page
  description: string; // factual object history (e.g. "The Mshatta Facade is a richly decorated stone wall from an 8th-century Desert Castle of Jordan...")
  contributor?: {
    name: string; // e.g. "Mansoor Alemy"
    quote: string; // pull-quote, e.g. "These scenes of creatures drinking water from one fountain together; for me, it shows peace."
    story?: string; // personal/migration narrative paragraph shown below the factual description
  };
  audioUrl?: string | null;
  audioDurationSeconds?: number; // drives the "1:03 / 3:00" style elapsed/total display
  pdfUrl?: string | null;
  journey?: {
    country: string; // e.g. "Myanmar"
    flag: string; // ISO country code for flag icon, e.g. "MM"
  }[]; // ordered From → To chain rendered by the migration-journey widget (replaces a lat/lng location model — see Story 5.7)
}
```

---

### Story 1.6: Create README Skeleton
**As a** developer  
**I want to** create a comprehensive README with setup instructions  
**So that** the project is easily understood and runnable by other developers

**Acceptance Criteria:**
- [ ] Project description and overview
- [ ] Tech stack summary (Next.js, Tailwind, GSAP)
- [ ] Prerequisites and setup instructions
- [ ] How to run the development server
- [ ] How to build for production
- [ ] Project structure documentation
- [ ] Notes on design decisions and assumptions
- [ ] Placeholder for challenges encountered and scope trade-offs

**Technical Notes:**
- Include sections for: Overview, Tech Stack, Setup, Running, Project Structure, Design Decisions
- Leave placeholders for post-development updates (challenges, trade-offs)
- Include any special considerations for the assignment submission

---

### Story 1.7: Build Shared Header & Footer Chrome
**As a** visitor  
**I want to** see consistent branding, navigation, and accessibility controls on every page  
**So that** the site feels like one cohesive exhibition, not three disconnected pages

**Acceptance Criteria:**
- [ ] Shared header shows the "Artifacta" logo mark (the small circular/arc icon, a simplified version of the landing disc motif) plus the "Artifacta" wordmark, present on Landing, List, and Detail pages
- [ ] Shared footer shows "Copyright ©2025 Artifacta" (left) and social icons for X/Twitter and YouTube (right), per the footer export
- [ ] Footer includes a pill-shaped utility cluster with a dark/light theme toggle (moon icon) and font-size controls ("A+" / "A-")
- [ ] Theme toggle switches the whole app between the dark-navy theme and a light variant, persisting the choice (e.g. localStorage)
- [ ] Font-size controls scale body text up/down within reasonable bounds, applied globally (e.g. via a root CSS custom property or Tailwind text-scale class on `<html>`)
- [ ] Header/footer are built as shared layout components (e.g. in the root or route-group layout) rather than duplicated per page
- [ ] Social icon links are functional anchors (can point to placeholder URLs) and open in a new tab

**Technical Notes:**
- Logo asset: `Logo (1).png` (arc/sunburst icon) — `Logo.png` export is a blank/transparent placeholder, not usable as-is
- Implement theme toggle via a `class="dark"` strategy on `<html>` + Tailwind `dark:` variants, or a small ThemeProvider context
- Font-size scaling can be a simple `--font-scale` CSS variable multiplied into base rem sizing, adjusted by the A+/A- buttons
- Keep this component tree in `/components/layout` (e.g. `SiteHeader`, `SiteFooter`) per the folder structure in Story 1.4

---

## Epic 2: Landing Page
**Goal:** Create a pixel-faithful landing page with smooth GSAP animations that sets the visual tone for the digital museum.

### Story 2.1: Build Landing Page Static Layout
**As a** visitor  
**I want to** see a beautifully designed landing page matching the Figma specifications  
**So that** I get a strong first impression of the digital museum experience

**Correction from earlier draft:** the font pairing below is inverted from what this story originally assumed. Copying the actual CSS out of Figma's inspect panel for the hero's "intro TXT" layout shows the headline *and* subtext both set in **Playfair Display** (57px/62px and 17px/28px respectively), while the "Enter Exhibition" CTA label is set in **Patua One** (15px/18px) — the reverse of the "Patua One headline / Playfair Display subtext" assumption below. Patua One is still the display font per the Story 1.2 pairing, it's just applied to the CTA/UI label here rather than the page headline.

**Acceptance Criteria:**
- [ ] Header shows the Artifacta logo + wordmark (per Story 1.7 shared chrome)
- [ ] Headline reads "Objects, Voices and Global Journeys" with subtext "Exploring identity through objects in a world shaped by migration."
- [ ] CTA button reads "Enter Exhibition" (filled dark pill per Figma; matches spacing/typography of the `CTA.png` export)
- [ ] Background disc graphic is positioned centered behind the headline, composed of concentric rings built from artifact pattern/texture crops (per `DISC.png`) — not a single flat orb image
- [ ] Footer matches Figma design and content (per Story 1.7)
- [ ] All text content is responsive and readable across breakpoints
- [ ] Colors, fonts (Playfair Display headline/subtext, Patua One CTA label — see correction note above), and spacing match Figma within reasonable pixel tolerance
- [ ] Layout is fully responsive (desktop, tablet, mobile)

**Technical Notes:**
- Use Tailwind classes for layout and styling
- The disc graphic is a stack of arc-segment rings, each ring assembled from different artifact photo/pattern crops — build it as a layered SVG/CSS composition (or precomposed image layers) so individual rings can later be animated independently in Story 2.2
- Reference Figma for exact spacing, typography, and color values
- Implement responsive breakpoints: desktop (default), tablet (md), mobile (sm)
- Ensure high fidelity at desktop breakpoint as primary target

---

### Story 2.2: Implement Background Disc Animation
**As a** visitor  
**I want to** see a subtle, continuous animation of the background disc graphic  
**So that** the landing page feels dynamic and engaging

**Acceptance Criteria:**
- [ ] Each concentric ring of the disc (per `DISC.png`, the graphic is built from 3+ nested arc-segment rings, not one flat orb) rotates continuously in a smooth loop
- [ ] Creative differentiation: rings rotate at different speeds and/or opposing directions to create a layered, parallax-like sunburst effect (this is the "feel free to show us your creativity" moment called out in the brief)
- [ ] Animation runs automatically on page load
- [ ] Animation is performant (uses transform/opacity, not layout-triggering properties)
- [ ] Animation resolves gracefully without jank
- [ ] Animation does not interfere with page performance or scrolling

**Technical Notes:**
- Use GSAP for the animation (one timeline/tween per ring, or a single timeline driving multiple targets)
- Each ring is its own DOM node/transform origin so rotation speed/direction can be set independently (e.g. outer ring 40s clockwise, middle ring 28s counter-clockwise, inner ring 20s clockwise)
- Use CSS transforms for GPU acceleration
- Ensure animation cleanup on component unmount

---

### Story 2.3: Add Scroll-Based Content Animations
**As a** visitor  
**I want to** see content elements animate in as I scroll down the page  
**So that** the experience feels polished and engaging

**Acceptance Criteria:**
- [ ] Headline animates in when entering viewport (fade/slide-in)
- [ ] Subtext animates in after headline (staggered timing)
- [ ] CTA button animates in after subtext (staggered timing)
- [ ] Animations use GSAP ScrollTrigger for viewport detection
- [ ] Each element animates only once (no re-trigger flicker)
- [ ] Animations do not block clicking/tapping the CTA at any point
- [ ] Animation timing feels natural and not sluggish

**Technical Notes:**
- Use GSAP ScrollTrigger for scroll-based animations
- Implement stagger effect for sequential element entrance
- Set `once: true` on ScrollTrigger to prevent re-triggering
- Use transform-based animations for performance
- Test that CTA remains clickable during animation

---

### Story 2.4: Wire CTA Navigation to List Page
**As a** visitor  
**I want to** click the "Enter Exhibition" button and navigate to the artifacts list page  
**So that** I can explore the museum collection

**Acceptance Criteria:**
- [ ] "Enter Exhibition" button is a functional Next.js Link component
- [ ] Clicking it navigates to the List Page route
- [ ] Navigation is smooth and instant (client-side routing)
- [ ] Button has both filled and outline hover/focus states matching the `CTA.png` export
- [ ] Button is accessible (keyboard navigable, proper ARIA labels)
- [ ] Navigation works across all breakpoints

**Technical Notes:**
- Use Next.js Link component for client-side routing
- Route path: `/list` or similar
- Ensure hover states match Figma design (filled pill → outline pill, or vice versa)
- Test navigation on desktop, tablet, and mobile

---

### Story 2.5: Responsive Polish for Landing Page
**As a** developer  
**I want to** ensure the landing page is fully responsive and polished  
**So that** the experience is consistent across all device sizes

**Acceptance Criteria:**
- [ ] Layout adapts correctly to desktop (default), tablet (md), and mobile (sm) breakpoints
- [ ] Typography scales appropriately across breakpoints
- [ ] Disc/orb graphic scales or adjusts position for smaller screens
- [ ] CTA button remains touch-friendly on mobile (minimum 44px height)
- [ ] No horizontal scroll on any breakpoint
- [ ] All animations perform well on mobile devices
- [ ] Testing completed on actual devices or browser dev tools

**Technical Notes:**
- Use Tailwind responsive prefixes (md:, sm:)
- Test in Chrome DevTools device emulation
- Prioritize desktop fidelity per brief, adapt for mobile
- Ensure touch targets meet accessibility guidelines

---

## Epic 3: List Page Foundation
**Goal:** Build the core artifacts list page with dual view modes and data-driven components.

### Story 3.1: Create Artifact Thumbnail Component
**As a** developer  
**I want to** create a reusable Artifact Thumbnail component  
**So that** artifact displays are consistent across Grid and List views

**Acceptance Criteria:**
- [ ] Grid variant: square thumbnail image with the artifact title captioned below (per `Gallery.png`/`THUMBNAILS.png`)
- [ ] List variant: thumbnail image + title on the left, an "Explore Story" text link with a circular arrow icon on the right (per `Link.png`), separated by a divider rule between rows
- [ ] A loading/skeleton state (checkerboard placeholder per `Thumbnail.png`) displays while the image loads
- [ ] Component accepts artifact data as props (id, title, thumbnail, type)
- [ ] Component is clickable (whole row/card, plus the explicit "Explore Story" link in list view) and routes to Detail page
- [ ] Component has hover states matching Figma design
- [ ] Component is responsive across breakpoints
- [ ] Component uses mock data from shared data layer
- [ ] No hardcoded content in component

**Technical Notes:**
```typescript
interface ArtifactThumbnailProps {
  artifact: Artifact;
  variant: 'grid' | 'list';
  onClick?: (id: string) => void;
}
```
- Use Next.js Image component for optimized images, with `placeholder="blur"` or a custom skeleton to match the loading state export
- Implement proper image aspect ratios from Figma
- Add hover effects (scale, shadow, or overlay)

---

### Story 3.2: Build Grid View Layout
**As a** visitor  
**I want to** see artifacts displayed in a grid layout  
**So that** I can browse the collection visually

**Acceptance Criteria:**
- [ ] Grid layout displays artifacts as uniform square thumbnails with title captions below, matching `Gallery.png` (dense multi-row grid, ~4-6 columns visible per viewport at desktop)
- [ ] Grid uses Artifact Thumbnail components (`variant="grid"`) for each item
- [ ] Grid is data-driven from mock data array
- [ ] Grid is displayed on an oversized canvas larger than viewport
- [ ] Grid spacing and alignment match Figma specifications
- [ ] Grid adapts to different screen sizes (responsive columns)
- [ ] Empty state handled if no artifacts exist

**Technical Notes:**
- Use CSS Grid for layout
- Implement oversized canvas concept (larger than viewport)
- Grid should be positioned absolutely or with overflow handling
- Use mock data from data layer
- Responsive column count: desktop (4-5), tablet (3-4), mobile (2-3)
- With only 12 mock artifacts, consider repeating/tiling the set (or generating a larger virtual canvas via CSS repeat) so the oversized-canvas drag experience has enough room to feel "free-roaming" per the brief

---

### Story 3.3: Build List View Layout
**As a** visitor  
**I want to** see artifacts displayed in a vertical list layout  
**So that** I can browse the collection textually

**Acceptance Criteria:**
- [ ] List layout displays artifacts as horizontal rows — small square thumbnail + title on the left, "Explore Story" link + arrow icon on the right, divider line between rows (per `THUMBNAILS.png`)
- [ ] List uses Artifact Thumbnail components (`variant="list"`)
- [ ] List is data-driven from mock data array
- [ ] List spacing and alignment match Figma specifications
- [ ] List is vertically scrollable with native scroll behavior
- [ ] List adapts to different screen sizes
- [ ] Empty state handled if no artifacts exist

**Technical Notes:**
- Use flexbox for horizontal row layout, stacked vertically
- Standard scrollable container (no drag/pan behavior in list mode)
- Reuse the same Thumbnail component in its `list` variant rather than a separate component
- Ensure smooth scrolling performance

---

### Story 3.4: Implement View Switcher Toggle
**As a** visitor  
**I want to** toggle between Grid and List views  
**So that** I can choose my preferred browsing experience

**Acceptance Criteria:**
- [ ] View switcher is a pill-shaped toggle reading "Switch to grid" / "Switch to list" with matching icon glyphs, per `view switcher.png` (the label swaps to describe the *other* view, i.e. it shows "Switch to grid" while already in list view, and vice versa)
- [ ] Toggle switches between Grid and List layouts
- [ ] Current view mode is visually indicated
- [ ] Toggle is accessible (keyboard navigable, proper ARIA labels)
- [ ] Toggle has smooth transition between views
- [ ] Toggle works across all breakpoints
- [ ] View mode state is managed in React state

**Technical Notes:**
```typescript
type ViewMode = 'grid' | 'list';
```
- Use React state for view mode management
- Implement smooth transition between views (fade or slide)
- Use `view switcher.png` icon glyphs from Figma assets; label text is dynamic based on current `ViewMode`
- Ensure toggle is touch-friendly on mobile

---

### Story 3.5: Wire Thumbnail Navigation to Detail Page
**As a** visitor  
**I want to** click an artifact thumbnail and navigate to its detail page  
**So that** I can explore individual artifacts in depth

**Acceptance Criteria:**
- [ ] Clicking a thumbnail (grid view) or the "Explore Story" link (list view) navigates to the Detail page with the artifact ID
- [ ] Navigation uses Next.js dynamic routing (e.g., `/detail/[id]`)
- [ ] If Detail page is not built, navigates to placeholder or shows alert
- [ ] Navigation passes artifact data or ID to Detail page
- [ ] Navigation is smooth and instant (client-side routing)
- [ ] Back navigation from Detail page returns to List page

**Technical Notes:**
- Use Next.js Link component with dynamic route
- Route structure: `/detail/[id]` or similar
- Pass artifact ID via URL params or router state
- Implement fallback if Detail page is not built (placeholder route)

---

## Epic 4: List Page Interaction
**Goal:** Implement advanced interactions including drag/pan canvas, touch support, and category filtering.

### Story 4.1: Implement Drag/Pan Canvas for Grid View
**As a** visitor  
**I want to** click and drag to pan around the grid in any direction  
**So that** I can explore the artifact collection freely

**Acceptance Criteria:**
- [ ] Grid view supports mouse drag to pan in any direction
- [ ] Grid view supports touch/swipe drag on mobile devices
- [ ] Drag cursor affordance shown on hover/drag start: a circular badge with a drag-hand icon and "Drag" label, per `drag icon.png` (two states exported — idle and hover/active — swap between them)
- [ ] Canvas has infinite/loose bounds (no hard edges that abruptly stop)
- [ ] Dragging feels smooth and responsive
- [ ] Drag does not interfere with clicking thumbnails
- [ ] Optional: inertia/momentum on release (nice-to-have)

**Technical Notes:**
- Implement custom drag handler using mouse/touch events
- Use transform (translate) for performant dragging
- Calculate delta from drag start position
- Implement loose bounds with easing at edges
- Consider inertia using momentum calculation (optional)
- Distinguish between drag and click (time threshold or movement threshold)

---

### Story 4.2: Add Category Filter Bar
**As a** visitor  
**I want to** filter artifacts by category  
**So that** I can focus on specific types of artifacts

**Acceptance Criteria:**
- [ ] Category filter bar matches Figma design: a rounded pill-group with "All Objects" as the first/default pill, followed by Architectural, Ceremonial, Decorative, Musical, Playful, Useable, Wearable (per `categories bar.png`)
- [ ] Selecting a category filters artifacts in both Grid and List views
- [ ] "All Objects" option shows the complete artifact set
- [ ] Selected category is visually indicated (filled pill vs. outline/muted pills)
- [ ] Filter state persists when switching between Grid and List views
- [ ] Filter bar is responsive across breakpoints (horizontal scroll on mobile, since 8 pills won't fit narrow viewports)

**Technical Notes:**
- Categories are a fixed enum (7 values), not dynamically derived from mock data, since the Figma bar is a designed, finite set — but still read from the shared data layer/types rather than hardcoded per component
- Implement filter logic in data utility functions
- Use React state for selected category
- Ensure filter updates both view modes
- Design filter bar to match Figma (horizontal scroll on mobile)

---

### Story 4.3: Implement Empty State Handling
**As a** visitor  
**I want to** see a helpful message when a filter returns no results  
**So that** I understand why no artifacts are displayed

**Acceptance Criteria:**
- [ ] Empty state message displays when filter returns zero artifacts
- [ ] Empty state is visually appealing and matches design language
- [ ] Empty state suggests selecting a different category
- [ ] Empty state does not crash or show broken layout
- [ ] Empty state works in both Grid and List views
- [ ] Empty state is responsive across breakpoints

**Technical Notes:**
- Check filtered array length before rendering
- Create EmptyState component with message and CTA
- Consistent styling with overall design
- Offer "Clear filters" or "View all" action

---

### Story 4.4: Preserve State Across View Mode Switching
**As a** visitor  
**I want to** maintain my filter selection when switching between Grid and List views  
**So that** my browsing context is not lost

**Acceptance Criteria:**
- [ ] Selected category filter persists when toggling Grid ⇄ List
- [ ] Scroll/pan position resets predictably when switching views
- [ ] No visual glitch during view mode transition
- [ ] State management is clean and maintainable
- [ ] View mode and filter state are independent but coordinated

**Technical Notes:**
- Use React state for both view mode and filter
- Reset scroll position on view switch (intentional per brief)
- Ensure smooth transition between views
- Consider URL state for filter persistence (optional)

---

### Story 4.5: Touch Support Optimization for Mobile
**As a** mobile user  
**I want to** use touch gestures naturally for drag and filtering  
**So that** the mobile experience feels native and intuitive

**Acceptance Criteria:**
- [ ] Grid view drag works with touch swipe gestures
- [ ] Touch drag is smooth and responsive on mobile devices
- [ ] Filter bar is touch-friendly (adequate touch targets)
- [ ] View switcher is touch-friendly on mobile
- [ ] No accidental gestures interfere with intended actions
- [ ] Touch feedback is provided (visual or haptic if available)
- [ ] Mobile performance is acceptable (60fps during interactions)

**Technical Notes:**
- Implement touch event handlers (touchstart, touchmove, touchend)
- Prevent default scroll behavior during drag
- Ensure touch targets meet minimum size (44px)
- Test on actual mobile devices or device emulation
- Consider passive event listeners for performance

---

## Epic 5: Details Page (Stretch/Optional)
**Goal:** Build the artifact detail page with media carousel and supplementary controls (only if time permits after Pages 1-2 are complete).

### Story 5.1: Build Detail Page Layout
**As a** visitor  
**I want to** see a detailed view of an artifact with all its information  
**So that** I can learn about the artifact in depth

**Acceptance Criteria:**
- [ ] Top bar shows an "All Objects" back-link (left) and a "Next story" button (right), per the detail-page mock, for sequential browsing without returning to the list every time
- [ ] Page displays: large serif title (e.g. "Mshatta Façade"), a divider rule, a "Contributed by [Name]" byline, another divider, an italicized pull-quote from the contributor, the audio player (Story 5.3), and two description paragraphs — one factual/historical about the object, one personal/migration narrative from the contributor
- [ ] Primary media area (left column on desktop) is prominently displayed with a "More Images" button (Story 5.2)
- [ ] Layout is responsive across breakpoints (media stacks above text on mobile)
- [ ] Page handles missing optional fields gracefully (no crash) — e.g. no contributor quote, no audio, no journey data
- [ ] Navigation back to List page is available via the "All Objects" link
- [ ] Back navigation preserves previous filter/view mode if feasible

**Technical Notes:**
- Use dynamic route `/detail/[id]`
- Fetch artifact data by ID from mock data
- Two-column layout on desktop (media left, text right), matching the Mshatta Façade detail mock
- Handle missing data with conditional rendering
- Implement "All Objects" and "Next story" navigation with proper routing (Next story = next artifact ID in the mock data array, wrapping around at the end)
- Consider URL state (query params) for preserving filter/view mode on return to List

---

### Story 5.2: Implement Media Carousel ("More Images")
**As a** visitor  
**I want to** step through multiple images of an artifact via a "More Images" control  
**So that** I can view the artifact from different angles or perspectives

**Acceptance Criteria:**
- [ ] Primary media frame shows a "More Images" button (bottom-right of the image, per the detail mock and `imgs component.png` reference set) that advances to the next supplementary image
- [ ] Each artifact's `media` array (5+ images for pieces like Mshatta Façade) is cycled through by repeated clicks/taps
- [ ] Carousel also supports swipe gesture on touch devices, and arrow-key/click navigation, so it isn't a "More Images"-only interaction on desktop
- [ ] Carousel loops back to the first image after the last
- [ ] Current slide position is indicated (dots, counter, or progress bar) in addition to the "More Images" label
- [ ] Carousel is responsive across breakpoints
- [ ] Carousel/media frame handles single-item or missing media gracefully (hides "More Images" if there's nothing to advance to)

**Technical Notes:**
- Use React state for current slide index
- Implement touch handlers for swipe detection
- Use CSS transforms for smooth slide transitions
- Add visual indicators (dots, arrows, or progress bar) alongside the "More Images" button
- Ensure images are optimized with Next.js Image component

---

### Story 5.3: Add Audio Player (Play/Pause, Waveform Scrubber, Listen)
**As a** visitor  
**I want to** listen to the contributor's audio commentary about the artifact  
**So that** I can have an auditory, first-person experience of the artifact's story

**Acceptance Criteria:**
- [ ] Audio player matches the Mshatta Façade detail mock exactly: a solid circular play/pause button (`play button.png` / `pause button.png`), a tick-mark waveform-style scrubber, and elapsed/total time labels formatted like "1:03" / "3:00"
- [ ] Play/pause button toggles audio playback and swaps icon state
- [ ] Scrubber reflects playback progress and is draggable/clickable to seek
- [ ] A mute/unmute speaker toggle is available (`sound.png`, two states)
- [ ] The "Listen to his story…" phrasing from the description copy can double as a call-to-action pointing at the player (per the mock's closing line)
- [ ] Component is visually present even if `audioUrl` is null (stubbed, disabled state)
- [ ] Audio controls are accessible (keyboard navigable, proper ARIA labels)
- [ ] Audio playback is smooth and does not block UI

**Technical Notes:**
- Use HTML5 Audio API for playback; drive the tick-mark scrubber visualization with CSS (evenly spaced ticks) rather than a real waveform analysis — the export is a stylized/decorative waveform, not literal audio data
- Format elapsed/total time as `m:ss` per the mock (`1:03`, `3:00`)
- Handle missing audio gracefully (disabled state, hidden scrubber)
- Consider a custom audio player component for consistent styling across artifacts
- Ensure audio doesn't autoplay (user interaction required)

---

### Story 5.4: Add Zoom Controls (Zoom In/Out)
**As a** visitor  
**I want to** zoom in and out on the artifact media  
**So that** I can examine fine details

**Note:** The `zoom in.png` / `zoom out.png` magnifying-glass icons exist as exported assets, but the one captured detail-page mock (Mshatta Façade) doesn't show them placed in the layout. Per the brief's own guidance ("at minimum visually present and wired to a functional or clearly-stubbed action — no dead, unstyled buttons"), treat this as a small icon-button pair layered on the media frame rather than a pixel-matched Figma composition.

**Acceptance Criteria:**
- [ ] Zoom controls use the exported zoom in/out icons, placed as an overlay on the media frame
- [ ] Zoom in button increases media scale
- [ ] Zoom out button decreases media scale
- [ ] Zoom is constrained within reasonable limits (e.g., 0.5x to 3x)
- [ ] Zoom is smooth and performant (uses CSS transform)
- [ ] Zoom state is reset when changing media items
- [ ] Zoom controls are accessible (keyboard navigable)

**Technical Notes:**
- Use CSS transform scale for zoom
- Implement pan when zoomed (optional but good UX)
- Limit zoom range to prevent breaking layout
- Reset zoom on carousel slide change
- Consider pinch-to-zoom on touch devices (stretch feature)

---

### Story 5.5: Add Download PDF Action
**As a** visitor  
**I want to** download a PDF document related to the artifact  
**So that** I can access additional information offline

**Note:** `Download pdf.png` exports as a small circular "PDF" icon button; no full download-flow mock was captured, so match the icon and wire the minimum functional/stubbed action the brief asks for.

**Acceptance Criteria:**
- [ ] Download button matches the circular "PDF" icon from `Download pdf.png`
- [ ] Clicking download initiates PDF download
- [ ] If pdfUrl is null, button is disabled or shows placeholder state
- [ ] Download action is functional (not a dead button)
- [ ] Button is accessible (keyboard navigable, proper ARIA labels)
- [ ] Download feedback is provided (loading state or confirmation)

**Technical Notes:**
- Use HTML5 download attribute or programmatic download
- Handle missing PDF gracefully (disabled state)
- Consider loading state for large files
- Ensure download works across browsers
- Match Figma design for button appearance

---

### Story 5.6: Add Comment Affordance
**As a** visitor  
**I want to** see or add comments about the artifact  
**So that** I can engage with other visitors' perspectives

**Note:** `Comment.png` exports only a small speech-bubble icon in three states (active/muted/outline) — no comment thread or form UI was found in the exports. This strongly suggests the intended scope is a single icon affordance, not a comment system.

**Acceptance Criteria:**
- [ ] Comment icon button matches the three exported states (active, muted/idle, outline) from `Comment.png`
- [ ] Clicking it opens a clearly-stubbed panel/modal (e.g. "Comments coming soon" or a minimal mock comment list) — a full persisted comment system is out of scope
- [ ] Comments are visually distinct and readable if a mock list is shown
- [ ] Button is accessible (keyboard navigable, proper ARIA label)
- [ ] Component degrades gracefully if comment data is missing

**Technical Notes:**
- This is a UI stub — full comment system is out of scope per the PRD's non-goals (no backend/auth)
- Mock comment data in artifact object if a list is shown, otherwise a static stub state is sufficient
- Match the icon's three states for idle/hover/active
- Document this scope decision in the README trade-offs section (Story 6.5)

---

### Story 5.7: Add Migration Journey Widget
**As a** visitor  
**I want to** see the countries an artifact (or its contributor) has moved through  
**So that** I understand the object's migration story — the core theme of the exhibition

**Correction from earlier draft:** The `location widget.png` export is **not** a lat/lng map pin — it's a horizontal chain of country flag icons connected by arrows, e.g. "From Myanmar → To Sri Lanka → To USA → To Myanmar". This directly reflects the site's tagline ("Objects, Voices and Global Journeys" / "a world shaped by migration") and should replace the generic "location" concept used in the original PRD's suggested data model.

**Acceptance Criteria:**
- [ ] Widget renders an ordered chain of flag + country-name steps connected by arrow separators, matching `location widget.png`
- [ ] First step is labeled "From [Country]", subsequent steps "To [Country]"
- [ ] Flags render from the artifact's `journey` array (Story 1.5 data model)
- [ ] If `journey` data is missing or has fewer than 2 steps, the widget is hidden entirely (no broken partial chain)
- [ ] Widget wraps gracefully on narrow viewports (horizontal scroll or wrap to a second line)
- [ ] Widget is visually integrated with the overall detail-page design

**Technical Notes:**
- Data shape: `journey: { country: string; flag: string }[]` (ordered), rendered as `From {journey[0]} → To {journey[1]} → To {journey[2]}...`
- Use a flag icon set/library keyed by ISO country code, or simple flag emoji as a lightweight fallback
- No map integration needed — this is a flat, iconographic route strip, not geodata
- Handle missing/short journey data gracefully (hide widget)
- Match Figma design for spacing, arrow glyph, and typography

---

### Story 5.8: Responsive Polish for Detail Page
**As a** developer  
**I want to** ensure the detail page is fully responsive and polished  
**So that** the experience is consistent across all device sizes

**Acceptance Criteria:**
- [ ] Layout adapts correctly to desktop, tablet, and mobile breakpoints
- [ ] Media carousel is touch-friendly on mobile
- [ ] All controls (audio, zoom, download, comment, location) are accessible on mobile
- [ ] No horizontal scroll on any breakpoint
- [ ] Touch targets meet minimum size requirements (44px)
- [ ] Performance is acceptable on mobile devices
- [ ] Testing completed on various screen sizes

**Technical Notes:**
- Use Tailwind responsive prefixes
- Test in Chrome DevTools device emulation
- Ensure all controls are touch-friendly
- Consider stacked layout for mobile vs side-by-side for desktop
- Optimize images for mobile bandwidth

---

## Epic 6: QA & Delivery
**Goal:** Ensure quality across all breakpoints, optimize performance, document the project, and prepare for submission.

### Story 6.1: Cross-Breakpoint Responsive QA
**As a** developer  
**I want to** test the application across all breakpoints  
**So that** the experience is consistent and functional on all devices

**Acceptance Criteria:**
- [ ] Landing page tested on desktop, tablet, and mobile
- [ ] List page tested on desktop, tablet, and mobile
- [ ] Detail page (if built) tested on desktop, tablet, and mobile
- [ ] All interactions work on touch devices
- [ ] No horizontal scroll on any breakpoint
- [ ] Typography is readable at all sizes
- [ ] Images and media load correctly at all breakpoints
- [ ] No console errors or warnings on any breakpoint

**Technical Notes:**
- Use Chrome DevTools device emulation
- Test on actual devices if possible
- Document any responsive issues found and fixed
- Prioritize desktop fidelity per brief, ensure mobile is functional

---

### Story 6.2: Animation Performance Pass
**As a** developer  
**I want to** optimize all animations for smooth performance  
**So that** the user experience is fluid and professional

**Acceptance Criteria:**
- [ ] Landing page disc animation runs at 60fps
- [ ] Scroll-triggered animations are smooth and non-blocking
- [ ] Grid drag/pan is smooth and responsive
- [ ] Media carousel transitions are smooth
- [ ] No layout thrashing or jank during animations
- [ ] Animations use GPU-accelerated properties (transform, opacity)
- [ ] GSAP contexts are properly cleaned up on unmount

**Technical Notes:**
- Use Chrome DevTools Performance tab to measure fps
- Check for layout thrashing in Performance profiles
- Ensure animations use transform/opacity only
- Implement proper cleanup in useEffect
- Test on lower-end devices if possible

---

### Story 6.3: Cross-Browser Compatibility Check
**As a** developer  
**I want to** test the application in multiple browsers  
**So that** it works reliably for all users

**Acceptance Criteria:**
- [ ] Application tested in Chrome (primary target)
- [ ] Application tested in Firefox
- [ ] Application tested in Safari (if possible)
- [ ] Application tested in Edge (if possible)
- [ ] All core functionality works across browsers
- [ ] Fallbacks implemented for unsupported features
- [ ] No browser-specific console errors

**Technical Notes:**
- Prioritize Chrome per typical development workflow
- Test in at least one additional browser
- Document any browser-specific issues
- Use standard web APIs for broad compatibility
- Consider polyfills if needed (unlikely for modern features)

---

### Story 6.4: Code Quality and Architecture Review
**As a** developer  
**I want to** review the codebase for quality and maintainability  
**So that** the code is clean, modular, and follows best practices

**Acceptance Criteria:**
- [ ] Components are modular and reusable
- [ ] File naming is clear and purposeful
- [ ] No hardcoded content in components (all data-driven)
- [ ] TypeScript types are properly defined and used
- [ ] Code follows consistent style and conventions
- [ ] No console errors or warnings in development
- [ ] Unused code and imports are removed
- [ ] Comments are minimal and only where necessary

**Technical Notes:**
- Run ESLint and fix all warnings
- Run TypeScript compiler with strict mode
- Review component structure for modularity
- Ensure data flow is clear and maintainable
- Remove any debug code or console.logs

---

### Story 6.5: Update README with Final Information
**As a** developer  
**I want to** update the README with project completion details  
**So that** the repository is well-documented for submission

**Acceptance Criteria:**
- [ ] Setup and run instructions are accurate and complete
- [ ] Tech stack is documented with versions
- [ ] Project structure is explained
- [ ] Design decisions and assumptions are documented
- [ ] Challenges encountered during development are noted
- [ ] Scope trade-offs are documented (e.g., if Detail page was skipped)
- [ ] Any known issues or limitations are noted
- [ ] Instructions for building and deploying are included

**Technical Notes:**
- Be honest about challenges and trade-offs
- Document what was built vs. what was planned
- Include any special considerations for the assignment
- Add screenshots if appropriate
- Ensure the README is professional and complete

---

### Story 6.6: Repository Cleanup and Organization
**As a** developer  
**I want to** clean up and organize the repository  
**So that** it is professional and ready for submission

**Acceptance Criteria:**
- [ ] All unnecessary files are removed (node_modules in .gitignore)
- [ ] Git repository is properly initialized with clear commit history
- [ ] .gitignore is properly configured
- [ ] Folder structure is logical and well-organized
- [ ] Assets are properly organized in /public
- [ ] No sensitive information is committed
- [ ] Repository is ready to be made public on GitHub

**Technical Notes:**
- Remove any debug files or temporary assets
- Ensure node_modules is in .gitignore
- Clean up any unused dependencies
- Organize assets in /public with clear structure
- Verify git history is clean and meaningful

---

### Story 6.7: Final Build and Deployment Test
**As a** developer  
**I want to** build the production version and verify it works  
**So that** the submission is production-ready

**Acceptance Criteria:**
- [ ] Production build completes without errors
- [ ] Built application is tested locally (e.g., `npm start` or static server)
- [ ] All functionality works in the production build
- [ ] No console errors in production build
- [ ] Performance is acceptable in production build
- [ ] Build size is reasonable for the scope
- [ ] Environment variables are properly configured (if any)

**Technical Notes:**
- Run `npm run build` and verify no errors
- Test production build locally with `npm start` or similar
- Check bundle size with Next.js build output
- Verify all animations and interactions work in production
- Document any production-specific issues

---

### Story 6.8: Create GitHub Repository and Submit
**As a** developer  
**I want to** create a public GitHub repository and submit  
**So that** the assignment is complete and submitted on time

**Acceptance Criteria:**
- [ ] Public GitHub repository is created
- [ ] Code is pushed to repository with clear commit history
- [ ] README is complete and professional
- [ ] Repository has a clear, descriptive name
- [ ] Repository has a description explaining the project
- [ ] Submission is made before the deadline (July 15, 2026)
- [ ] Repository URL is shared with the evaluation team

**Technical Notes:**
- Create repository with professional name (e.g., "digital-museum-assignment")
- Write clear commit messages
- Ensure repository is public (not private)
- Double-check all files are committed
- Submit repository URL through the appropriate channel

---

## Summary

**Total Epics:** 6  
**Total Stories:** 38  

**Required Scope (Pages 1-2):**
- Epic 1: Project Setup (7 stories — includes Story 1.7, shared header/footer chrome)
- Epic 2: Landing Page (5 stories)
- Epic 3: List Page Foundation (5 stories)
- Epic 4: List Page Interaction (5 stories)
- Epic 6: QA & Delivery (8 stories)

**Optional/Stretch Scope (Page 3):**
- Epic 5: Details Page (8 stories)

**Implementation Priority:**
1. Complete all stories in Epics 1-4 and Epic 6
2. Only attempt Epic 5 (Details Page) if time permits after required scope is complete and polished

**Key Success Criteria:**
- Pixel-faithful implementation of Figma designs — including brand details only visible in the exports: "Artifacta" name/logo, Patua One + Playfair Display fonts, "Enter Exhibition" CTA copy, the real 12-artifact/7-category dataset, and the migration-journey widget (not a map/lat-lng widget)
- Smooth, non-blocking animations using GSAP
- Clean, modular component architecture
- Data-driven content (no hardcoded content)
- Responsive across desktop, tablet, and mobile
- Public GitHub repository with professional documentation
- Submission by July 15, 2026 deadline

**Open item:** `_bmad-output/implementation-artifacts/sprint-status.yaml` still tracks the original 33-story breakdown (6 stories in Epic 1, no shared-chrome story) and points at `_bmad-output/planning-artifacts/EPICS_AND_STORIES.md`, which doesn't exist — the real file lives at the repo root. If sprint tracking is being used going forward, it needs a follow-up pass to add `1-7-build-shared-header-footer-chrome` and fix the story-location path.
