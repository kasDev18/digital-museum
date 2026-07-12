# GSAP Performance & Usage Guidelines

Reference for anyone adding GSAP animations to this codebase (Story 1.3 and
onward — landing page hero, scroll-based content reveals, list page
transitions, etc.).

## Setup

Always import `gsap`, `ScrollTrigger`, and `useGSAP` from
[`@/lib/gsap-utils`](../src/lib/gsap-utils.ts) rather than directly from
`gsap` / `@gsap/react`. That module is the single place `ScrollTrigger` and
`useGSAP` get registered via `gsap.registerPlugin(...)` — importing straight
from `gsap` risks using the plugin before it's registered, or registering it
twice.

```ts
import { gsap, useGSAP } from '@/lib/gsap-utils'
```

## Context management & cleanup

Every component that creates tweens or `ScrollTrigger`s must wrap that work in
the `useGSAP()` hook (from `@gsap/react`), scoped to a container ref:

```tsx
const container = useRef<HTMLDivElement>(null)

useGSAP(
  () => {
    gsap.from('.my-el', { opacity: 0, y: 40 })
  },
  { scope: container },
)

return <div ref={container}>...</div>
```

`useGSAP` wraps `gsap.context()` internally: on unmount (or on Fast Refresh in
dev) it automatically reverts every tween, timeline, and `ScrollTrigger`
created inside the callback. Without this, animations and their scroll
listeners leak across route changes and duplicate on every hot reload. Never
call `gsap.to`/`gsap.from`/`ScrollTrigger.create` directly in a
`useEffect` — use `useGSAP` instead.

## Animate GPU-friendly properties only

Only animate `transform` (`x`, `y`, `scale`, `rotation`) and `opacity`
(`autoAlpha`). Both are compositor-only properties the browser can animate on
the GPU without triggering layout or paint. Avoid animating `top`/`left`/
`width`/`height`/`margin` — those force layout recalculation on every tick.

- Prefer `autoAlpha` over `opacity` when an element should also be
  `display: none`/removed from the tab order at `opacity: 0` (it also toggles
  `visibility`).
- Set `force3D: true` (or rely on GSAP's default) so transforms promote to
  their own compositor layer.

## `will-change`

Add the `will-change-transform` Tailwind utility only to elements that are
about to animate, and only for the duration of that animation — it's a hint
to pre-allocate a compositor layer, not a general-purpose optimization.
Leaving it on too many elements (or permanently) increases GPU memory
pressure and can hurt performance instead of helping it. The demo component
(`GsapScrollDemo`) applies it directly to the animated panels as an example.

For an element that animates continuously for its entire mounted lifetime
(e.g. an infinite `repeat: -1` ambient loop, not a one-off entrance
animation), it's reasonable to apply `will-change-transform` permanently in
its CSS Module rather than toggling it at animation start/end — there's no
"idle" period to remove the hint during. `LandingHeroDisc` (Story 2.2, the
landing page's rotating background disc) is an example of this variant.

## Reduced motion

Gate scroll/entrance animations behind `prefers-reduced-motion` using
`gsap.matchMedia()` so users who've opted out of motion still see final
content state without the animation:

```ts
const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // animation setup here
})
```

See `GsapScrollDemo` for a working example of this pattern combined with
`ScrollTrigger`.

## Batching many similar triggers

When animating a list/grid of similar elements (e.g. artifact thumbnails),
prefer `ScrollTrigger.batch()` over creating one `ScrollTrigger` per element —
it groups intersecting elements into a single callback and avoids the
overhead of dozens of individual observers.

### Pitfall: set the hidden state up front, not inside `onEnter`

`ScrollTrigger.batch()`'s `onEnter` only runs once an element actually
crosses `start` — it does **not** hide the element for you beforehand. If you
create the tween lazily inside `onEnter` with `gsap.from(batch, { autoAlpha: 0, ... })`,
the element has no hidden state until the moment it's already scrolled into
place, so it renders fully visible from page load and only "pops" through the
tween right at the trigger point instead of genuinely revealing on scroll.
Set the hidden state immediately (before scrolling can even happen), then
animate _to_ the visible state in `onEnter`:

```ts
const boxes = gsap.utils.toArray<HTMLElement>('.reveal')
gsap.set(boxes, { autoAlpha: 0, y: 80 }) // hidden immediately, not lazily

ScrollTrigger.batch(boxes, {
  start: 'top 80%',
  onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.15 }),
})
```

Also watch what element you attach a trigger to: a `ScrollTrigger` bound to a
container that already sits at the top of the page (`start: 'top 80%'` with
the container's top at scroll position 0) is already past its `start`
condition on load, so it fires immediately instead of on scroll. Give each
animated element (or group, via `batch()`) its own trigger, and make sure
there's enough content/spacing above it that it actually starts below the
fold.

## Verifying setup

`src/app/gsap-demo/page.tsx` renders `GsapScrollDemo`, a minimal
scroll-triggered fade/slide-in used to confirm the GSAP, ScrollTrigger, and
`useGSAP` wiring works end to end. Run `pnpm dev` and visit `/gsap-demo` to
see it in action.
