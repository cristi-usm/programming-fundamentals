import { defineConfig } from 'unocss'
import { LESSONS, MODULES } from '../lessons'

/**
 * Icon classes that live in `common/lessons.json` need two things.
 *
 * UnoCSS generates a utility only when it finds the class as a literal in a
 * module it scans, and by default it never scans `.json`, so the `i-ph-*`
 * names in the lesson registry are invisible to it and `<LessonCard>` /
 * `<DeckNav>` would render an empty box where the icon goes.
 *
 * - `content.pipeline.include` adds the registry to what UnoCSS scans. Every
 *   deck imports it (through `common/lessons.ts`), so in dev an edited icon is
 *   picked up on hot reload, like a class typed in a `.vue` file.
 * - `safelist` is the same list read once at startup. It is what guarantees
 *   the icons in a build, whatever the module graph looks like.
 *
 * The safelist alone used to be the whole fix, and it went stale: a dev server
 * started before an icon was added kept rendering that icon as an empty box
 * until it was restarted.
 *
 * Every deck re-exports this from its own `setup/unocss.ts` (Slidev calls the
 * default export of that file and merges the config it returns), because
 * <DeckNav> shows lesson icons at the end of every deck, not only on the hub.
 */
const registryIcons = [
  ...MODULES.map(m => m.icon),
  ...LESSONS.map(l => l.icon),
]

/**
 * UnoCSS's own default include (`@unocss/vite`), which `include` replaces
 * rather than extends: leaving it out would stop UnoCSS scanning the slides.
 */
const DEFAULT_PIPELINE_INCLUDE = /\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|marko|html)($|\?)/

/** Slidev *calls* this default export — it must be a function, not a config. */
export default () =>
  defineConfig({
    content: {
      pipeline: {
        include: [DEFAULT_PIPELINE_INCLUDE, /common\/lessons\.json($|\?)/],
      },
    },
    safelist: [...new Set(registryIcons)],
  })
