/**
 * Clicks that evaporate once a lesson is past.
 *
 * A lecture wants `v-click`: the class sees one idea at a time and cannot read
 * ahead. An archived lesson wants the opposite — a student revisiting lesson 3
 * in week 9 should see the whole slide at once, not press Space through it.
 *
 * So the clicks are written once, in the deck, and REMOVED from the markdown
 * for every deck that is not `THEME_CONFIG.currentLesson`. This runs as a
 * Slidev markdown transformer, i.e. before Vue ever compiles the slide, which
 * matters: hiding clicked content with CSS would leave the click COUNT intact,
 * so a slide with five reveals would still swallow five presses of Space and
 * lie in the progress bar. Removing the directives from the source means the
 * archived deck genuinely has zero click steps.
 *
 * It is therefore a build/dev-time switch. Advancing `currentLesson` in
 * common/theme/config.ts and restarting is what freezes a lesson into its flat
 * form — same shape as everything else here, where lessons.json and config.ts
 * are read once and the decks fall out of them.
 *
 * Override for a quick check without touching config:
 *
 *   FP_CLICKS=keep  pnpm dev:03-io   # force clicks on  (preview the lecture)
 *   FP_CLICKS=strip pnpm dev:01-intro # force clicks off (preview the archive)
 *
 * What is stripped: the `v-click` / `v-clicks` / `v-after` attributes, and the
 * `<v-click>` / `<v-clicks>` wrapper tags (their contents stay). Matches inside
 * fenced code blocks are left alone, so a slide may show `v-click` as an
 * example. `v-mark` is NOT touched — it is a decoration, not a reveal, and its
 * own `at=` would need separate care.
 */
import { basename, dirname } from 'node:path'
import type { MarkdownTransformContext, TransformersSetup } from '@slidev/types'
import { defineTransformersSetup } from '@slidev/types'
import { THEME_CONFIG } from '../theme/config.ts'

/** ` v-click`, ` v-clicks="3"`, ` v-click.hide`, ` v-after` — attribute form. */
const ATTR = /\s+v-(?:clicks?|after)(?:\.[\w.-]+)*(?:=(?:"[^"]*"|'[^']*'|\{[^}]*\}))?(?=[\s/>])/g

/** `<v-click>`, `<v-clicks depth="2">`, `</v-clicks>`, `<v-click />` — tag form. */
const TAG = /<\/?v-clicks?(?:\s[^>]*?)?\/?>/g

/** Fenced-code spans in the source, so examples that mention v-click survive. */
function fencedRanges(md: string): [number, number][] {
  const ranges: [number, number][] = []
  const fence = /^([ \t]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\2[^\n]*$/gm
  for (const match of md.matchAll(fence))
    ranges.push([match.index, match.index + match[0].length])
  return ranges
}

function stripClicks({ s }: MarkdownTransformContext): void {
  const md = s.original
  const fenced = fencedRanges(md)
  const inCode = (at: number) => fenced.some(([from, to]) => at >= from && at < to)

  for (const re of [ATTR, TAG]) {
    for (const match of md.matchAll(re)) {
      if (!inCode(match.index))
        s.remove(match.index, match.index + match[0].length)
    }
  }
}

/**
 * @param setupDir the deck's `setup/` directory — pass `import.meta.dirname`
 *                 from the deck's own `setup/transformers.ts`.
 */
export function clicksForCurrentLessonOnly(setupDir: string): TransformersSetup {
  const slug = basename(dirname(setupDir))
  const override = process.env.FP_CLICKS
  const keepClicks = override
    ? override === 'keep'
    : slug === THEME_CONFIG.currentLesson

  return defineTransformersSetup(() => ({
    // `pre` runs before Slidev's own transformers, on untouched markdown.
    pre: keepClicks ? [] : [stripClicks],
  }))
}
