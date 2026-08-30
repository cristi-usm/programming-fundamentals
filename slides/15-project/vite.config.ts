import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { componentDirs } from '../../common/vite/component-dirs.ts'
import { multiPublicPlugin } from '../../common/vite/multi-public-plugin.ts'

const COMMON = resolve(import.meta.dirname, '../..', 'common')

export default defineConfig({
  plugins: [
    // Serve shared assets (C.png, github.svg) from common/public as if they
    // lived in this deck's own public/ dir.
    multiPublicPlugin([resolve(COMMON, 'public')]),
  ],

  slidev: {
    components: {
      // Slidev REPLACES its default dirs with this list — see componentDirs().
      dirs: componentDirs(import.meta.dirname),
    },
  },

  // A busy port must fail loudly. Vite would otherwise fall back to the next
  // free one, and every cross-deck link — whose port comes from
  // common/lessons.json — would then silently point at the wrong deck.
  server: { strictPort: true },
})
