/**
 * Syntax highlighting: the course's own `pseudocod` language, plus the builtin
 * grammars the decks use.
 *
 * Pseudocode is written in Romanian, so no upstream grammar knows it. Without
 * one it has to be fenced as ```text — a wall of one colour, where `dacă` and
 * `citește` look exactly like the variable names around them. The whole point
 * of the pseudocode slide is that the STRUCTURE is visible before any syntax
 * exists, so the structural words are the ones that must stand out.
 *
 * ⚠️ `langs` REPLACES Slidev's auto-detected list rather than extending it — the
 * same trap as `components.dirs` (CLAUDE.md §7). Every language used in any deck
 * must therefore be listed here by hand, or its blocks silently render as plain
 * text. Check with:
 *
 *   grep -rhoE '^```[a-z]+' slides/ * /slides.md | sort -u
 *
 * Each deck's `setup/shiki.ts` re-exports this file.
 */
import type { LanguageRegistration } from 'shiki'
import { defineShikiSetup } from '@slidev/types'

/** Word boundaries that understand ă â î ș ț — `\b` does not. */
const W = '[\\p{L}\\p{N}_]'
const word = (alternatives: string) => `(?<!${W})(?:${alternatives})(?!${W})`

const pseudocod: LanguageRegistration = {
  name: 'pseudocod',
  scopeName: 'source.pseudocod',
  patterns: [
    // Control flow — the shape of the algorithm.
    {
      name: 'keyword.control.pseudocod',
      match: word('dacă|altfel|cât timp|repetă|pentru fiecare|pentru|până|execută|oprește-te|sfârșit'),
    },
    // Input/output — where the program touches the outside world.
    {
      name: 'support.function.pseudocod',
      match: word('citește|afișează|scrie|returnează'),
    },
    // Assignment. `←` is deliberately not `=`: nothing is being compared.
    { name: 'keyword.operator.assignment.pseudocod', match: '←|<-' },
    { name: 'keyword.operator.pseudocod', match: '≠|≤|≥|[<>+*/=-]|−' },
    { name: 'constant.numeric.pseudocod', match: '(?<!\\p{L})\\d+(?:\\.\\d+)?' },
    { name: 'comment.line.pseudocod', match: '//.*$' },
    { name: 'string.quoted.double.pseudocod', match: '"[^"]*"' },
  ],
}

export default defineShikiSetup(() => ({
  langs: ['c', 'cpp', 'bash', 'python', 'js', 'text', pseudocod],
}))
