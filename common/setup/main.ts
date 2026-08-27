import { defineAppSetup } from '@slidev/types'
import { LESSONS, MODULES } from '../lessons'
import { THEME_CONFIG } from '../theme/config'

/**
 * Shared app setup, run by every deck's own setup/main.ts.
 *
 * The components under common/components are not registered here — each deck's
 * vite.config.ts adds that directory to Slidev's auto-import dirs instead, so
 * the compiler knows the names. (Global registration alone loses `<LessonGrid/>`
 * to unplugin-icons; see the comment in any deck's vite.config.ts.)
 */
export default defineAppSetup(({ app }) => {
  app.mixin({
    mounted() {
      if (typeof document === 'undefined') return

      const pageRoot = document.getElementById('page-root')
      if (pageRoot && !pageRoot.classList.contains(THEME_CONFIG.scheme)) {
        pageRoot.classList.add(THEME_CONFIG.scheme)
      }

      if (Object.keys(THEME_CONFIG.customVars).length > 0) {
        const root = document.documentElement
        Object.entries(THEME_CONFIG.customVars).forEach(([key, value]) => {
          root.style.setProperty(key, value)
        })
      }
    },
  })

  // Exposed for markdown interpolation ({{ $lessonCount }}), so prose on the hub
  // cannot drift from the registry.
  app.config.globalProperties.$lessonCount = LESSONS.length
  app.config.globalProperties.$moduleCount = MODULES.length

  app.provide('themeConfig', THEME_CONFIG)
})
