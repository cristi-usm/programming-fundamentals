import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const require = createRequire(import.meta.url)

/** `<pkg>/components`, or null when the package (or that dir) is absent. */
function packageComponents(id: string): string | null {
  let dir: string
  try {
    dir = resolve(dirname(require.resolve(`${id}/package.json`)), 'components')
  } catch {
    return null
  }
  return existsSync(dir) ? dir : null
}

/**
 * Auto-import dirs for a deck, in resolution order.
 *
 * Slidev spreads `slidev.components` over its own defaults, so passing `dirs`
 * REPLACES its list — the builtins (<Toc/>, <Link/>), the theme's components
 * (<Admonition/>, <SpeechBubble/>, the Kawaii characters) and the deck's own
 * components/ all stop resolving, silently: Vue renders the unknown tag as a
 * plain HTML element, so a <SpeechBubble> shows its text with no bubble around
 * it rather than raising an error. Anything overriding `dirs` must therefore
 * re-list them, which is what this does.
 *
 * @param deckRoot the deck directory (`import.meta.dirname` in its vite.config)
 */
export function componentDirs(deckRoot: string): string[] {
  const common = resolve(deckRoot, '../..', 'common', 'components')

  return [
    // Slidev's own built-in components.
    resolve(dirname(require.resolve('@slidev/client/package.json')), 'builtin'),
    // Theme and addons — Neversink nests the Kawaii characters, and
    // unplugin-vue-components scans nested dirs by default.
    packageComponents('slidev-theme-neversink'),
    packageComponents('slidev-addon-cpp-runner'),
    // Shared components (<LessonGrid/>, <DeckNav/>, …), as if they were the
    // deck's own. Registering them globally in setup/main.ts is not enough: the
    // compiler never learns those names, so unplugin-icons claims them first.
    // With the full @iconify/json set installed, `<LessonGrid/>` kebab-cases to
    // the icon `la/b-grid` (la = Line Awesome) and the build dies on a missing
    // icon. A directory entry is resolved before any resolver, so this wins.
    common,
    // The deck's own components/, last so it can shadow any of the above.
    resolve(deckRoot, 'components'),
  ].filter((dir): dir is string => dir !== null && existsSync(dir))
}
