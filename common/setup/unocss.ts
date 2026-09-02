import { defineConfig } from 'unocss'
import { LESSONS, MODULES } from '../lessons'

/**
 * Icon classes that live in `common/lessons.json` need a safelist.
 *
 * UnoCSS generates a utility only when it finds the class as a literal in a
 * file it scans — `.vue`, `.md`, `.ts`. It never opens `.json`, so the
 * `i-ph-*` names in the lesson registry are invisible to it and
 * `<LessonCard>` / `<DeckNav>` would render an empty box where the icon goes.
 *
 * Every deck re-exports this from its own `setup/unocss.ts` (Slidev calls the
 * default export of that file and merges the config it returns), because
 * <DeckNav> shows lesson icons at the end of every deck, not only on the hub.
 */
const registryIcons = [
  ...MODULES.map(m => m.icon),
  ...LESSONS.map(l => l.icon),
]

/** Slidev *calls* this default export — it must be a function, not a config. */
export default () =>
  defineConfig({
    safelist: [...new Set(registryIcons)],
  })
