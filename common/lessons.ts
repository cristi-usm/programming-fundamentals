import data from './lessons.json'

export interface Lesson {
  num: number
  slug: string
  port: number
  module: number
  /** UnoCSS icon class, e.g. `i-ph-rocket-launch-duotone`. */
  icon: string
  title: string
  description: string
  /** Absent means the deck is still a scaffold. Set to 'ready' once written. */
  status?: 'draft' | 'ready'
  /**
   * Whether the deck is released to students. Unpublished lessons still appear
   * on the hub grid, but locked — the semester walks this flag forward.
   */
  published?: boolean
  /** Moodle URL of the lab sheet (PDF). Absent while the sheet is not up yet. */
  sheet?: string
}

export interface LessonModule {
  id: number
  /** UnoCSS icon class, e.g. `i-ph-cube-duotone`. */
  icon: string
  title: string
}

export const REPO: string = data.repo
export const MODULES: LessonModule[] = data.modules
export const LESSONS: Lesson[] = data.lessons as Lesson[]

/** Dev-server port of the hub deck. */
export const HUB_PORT = 3030

/**
 * Slide number of the lesson grid inside the hub deck — where 🏠 and the
 * end-of-deck nav send you. Kept here so moving the grid in
 * `slides/00-hub/slides.md` is a one-line change, not a hunt through
 * components.
 */
export const HUB_LESSONS_SLIDE = 10

/** Every slug that can appear as a path segment in the built site. */
const DECK_SLUGS = new Set<string>(LESSONS.map(l => l.slug))

const DEV_PORTS: Record<string, number> = Object.fromEntries(LESSONS.map(l => [l.slug, l.port]))

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
    return LESSONS.find(l => l.port === port)?.slug ?? null
  }

  const segments = baseSegments()
  const last = segments[segments.length - 1]
  return last && DECK_SLUGS.has(last) ? last : null
}

export function lessonBySlug(slug: string | null): Lesson | undefined {
  return LESSONS.find(l => l.slug === slug)
}

/** Previous and next lesson relative to `slug`, for end-of-deck navigation. */
export function neighbours(slug: string | null): { prev?: Lesson; next?: Lesson } {
  const index = LESSONS.findIndex(l => l.slug === slug)
  if (index === -1) return {}
  return { prev: LESSONS[index - 1], next: LESSONS[index + 1] }
}

export function lessonsOfModule(moduleId: number): Lesson[] {
  return LESSONS.filter(l => l.module === moduleId)
}

/** A deck that exists but has not been written yet. */
export function isDraft(lesson: Lesson): boolean {
  return lesson.status !== 'ready'
}

/**
 * A lesson students can open. Everything else is visible but locked, so the
 * hub shows the whole semester without handing out decks we haven't taught.
 */
export function isPublished(lesson: Lesson | undefined): boolean {
  return !!lesson?.published
}
