/**
 * `SiteHeader`/`SiteFooter` render outside the landing page's own component
 * tree (they're siblings of `{children}` in the root layout, shared across
 * every route), so `LandingHeroContentReveal` can't hand them a ref or a
 * prop — a plain window event is the simplest way to tell them "the hero
 * text just started revealing" without introducing a context provider that
 * every other route would also have to sit inside.
 */
const LANDING_REVEAL_EVENT = 'landing:hero-reveal'

export function dispatchLandingReveal() {
  window.dispatchEvent(new Event(LANDING_REVEAL_EVENT))
}

export function subscribeToLandingReveal(callback: () => void) {
  window.addEventListener(LANDING_REVEAL_EVENT, callback)
  return () => window.removeEventListener(LANDING_REVEAL_EVENT, callback)
}
