import data from './labs.json'

export interface Lab {
  num: number
  slug: string
  port: number
  module: number
  icon: string
  title: string
  description: string
  /** Absent means the deck is still a scaffold. Set to 'ready' once written. */
  status?: 'draft' | 'ready'
}

export interface LabModule {
  id: number
  emoji: string
  title: string
}

export const REPO: string = data.repo
export const MODULES: LabModule[] = data.modules
export const LABS: Lab[] = data.labs as Lab[]

/** Dev-server port of the hub deck. */
export const HUB_PORT = 3030

/** Every slug that can appear as a path segment in the built site. */
const DECK_SLUGS = new Set<string>(LABS.map(l => l.slug))

const DEV_PORTS: Record<string, number> = Object.fromEntries(LABS.map(l => [l.slug, l.port]))

/**
 * In dev each deck is a separate `slidev` server on its own port, so cross-deck
 * links must be absolute `localhost:<port>` URLs. In a build they are paths
 * under a shared base.
 *
 * This checks only `import.meta.env.DEV` — deliberately not the hostname. A
 * production build previewed on localhost is still a production build, and must
 * use the built subdirectories rather than dev ports that aren't running.
 */
function isDev(): boolean {
  return !!import.meta.env?.DEV
}

/**
 * Segments of this deck's own base, e.g. `['programming-fundamentals-lab', '05-arrays']`.
 *
 * Each deck is built with `--base <BASE_PATH>/<slug>/` (see scripts/build.mjs),
 * and Vite bakes that into `import.meta.env.BASE_URL`. Reading it there is exact
 * on every route.
 *
 * Deriving this from `window.location` instead would be wrong: Slidev serves
 * `/presenter/12`, `/overview` and `/notes` alongside `/12`, so no amount of
 * stripping trailing path segments identifies the base reliably.
 */
function baseSegments(): string[] {
  return (import.meta.env?.BASE_URL || '/').split('/').filter(Boolean)
}

/**
 * Deployment base path shared by every deck — `/` locally, `/<repo>/` on
 * GitHub Pages. It is this deck's base with its own slug removed.
 */
function basePath(): string {
  const segments = baseSegments()

  // Drop our own deck slug — what is left is the base the whole site shares.
  // (The hub is published at the base itself, so it has no slug to drop.)
  if (segments.length && DECK_SLUGS.has(segments[segments.length - 1])) segments.pop()

  return segments.length ? `/${segments.join('/')}/` : '/'
}

/**
 * URL of another deck in this course.
 *
 * @param slug  Deck slug, or `null` for the hub.
 * @param slide Optional 1-based slide number to land on.
 */
export function deckUrl(slug: string | null, slide?: number): string {
  const suffix = slide ? String(slide) : ''

  if (isDev()) {
    const port = slug === null ? HUB_PORT : DEV_PORTS[slug]
    // An unknown slug has no dev server to point at — fall back to the hub.
    if (!port) return `http://localhost:${HUB_PORT}/`
    return `http://localhost:${port}/${suffix}`
  }

  return `${basePath()}${slug ? `${slug}/` : ''}${suffix}`
}

/**
 * The slug of the deck currently being viewed, or `null` when in the hub.
 *
 * In dev every deck is served at the root of its own server, so the base carries
 * no slug and the port identifies the deck instead. In a build the slug is the
 * last segment of the deck's own base.
 */
export function currentSlug(): string | null {
  if (isDev()) {
    if (typeof window === 'undefined') return null
    const port = Number(window.location.port)
    if (port === HUB_PORT) return null
    return LABS.find(l => l.port === port)?.slug ?? null
  }

  const segments = baseSegments()
  const last = segments[segments.length - 1]
  return last && DECK_SLUGS.has(last) ? last : null
}

export function labBySlug(slug: string | null): Lab | undefined {
  return LABS.find(l => l.slug === slug)
}

/** Previous and next lab relative to `slug`, for end-of-deck navigation. */
export function neighbours(slug: string | null): { prev?: Lab; next?: Lab } {
  const index = LABS.findIndex(l => l.slug === slug)
  if (index === -1) return {}
  return { prev: LABS[index - 1], next: LABS[index + 1] }
}

export function labsOfModule(moduleId: number): Lab[] {
  return LABS.filter(l => l.module === moduleId)
}

/** A deck that exists but has not been written yet. */
export function isDraft(lab: Lab): boolean {
  return lab.status !== 'ready'
}
