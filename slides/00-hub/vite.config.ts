import { resolve } from 'node:path'
import { defineConfig } from 'vite'
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
      // Auto-import the shared components (<LabGrid/>, <DeckNav/>, …) as if
      // they were this deck's own.
      //
      // Registering them globally in setup/main.ts is not enough: the compiler
      // never learns those names, so unplugin-icons claims them first. With the
      // full @iconify/json set installed, `<LabGrid/>` kebab-cases to the icon
      // `la/b-grid` (la = Line Awesome) and the build dies on a missing icon.
      // A directory entry is resolved before any resolver, so this wins.
      dirs: [resolve(COMMON, 'components')],
    },
  },

  // A busy port must fail loudly. Vite would otherwise fall back to the next
  // free one, and every cross-deck link — whose port comes from
  // common/labs.json — would then silently point at the wrong deck.
  server: { strictPort: true },
})
