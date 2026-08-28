---
name: slide-code-blocks
description: Show code on a slide — syntax highlighting, line highlighting per click, Monaco editors, runnable blocks (monaco-run) and custom language runners, magic-move morphing between versions, code groups, imported snippets, twoslash types, line numbers and max height. Use when a slide contains a code block or code needs to be edited, run, or animated.
---

# Code on slides

Slidev highlights fenced code blocks with Shiki. Everything below is an addition to the
plain ```` ```lang ```` block.

## Line highlighting

Line numbers in braces after the language, 1-based:

````md
```c {2,4-6}
```
````

`|` splits it into click steps — the highlight moves as you advance:

````md
```c {2-3|5|all}
```
````

Special values: `none` highlights nothing, `hide` hides the block entirely. Combine with
`{at:3}` to bind the steps to an absolute click, which is how you sync two code blocks
side by side:

````md
```js {1|2}{at:1}
1 + 1
'a' + 'b'
```

```js {1|2}{at:1}
= 2
= 'ab'
```
````

Options object (second brace group): `{lines:true}` line numbers, `{startLine:5}`,
`{maxHeight:'200px'}` scrollable, `{at:…}`. Use `{*}` as the highlight placeholder when you
only want options: ```` ```c {*}{lines:true} ````.

## Monaco editor

`{monaco}` turns the block into a real editor. Nothing is saved unless you ask for it.

````md
```ts {monaco}
console.log('edit me')
```
````

- `{monaco-diff}` with `~~~` separating original from modified — a before/after view
- `{monaco-write}` writes edits back to the source file
- `{height:'auto'}` grows as you type; any CSS unit works
- `{lines:true}` toggles line numbers for that editor

## Runnable code

`{monaco-run}` adds a Run button and shows output below the editor, re-evaluating as you
type.

````md
```ts {monaco-run}
function distance(x: number, y: number) {
  return Math.sqrt(x ** 2 + y ** 2)
}
console.log(distance(3, 4))
```
````

- `{autorun:false}` waits for a click instead of running on slide load
- `{showOutputAt:'+1'}` reveals the output on a click — same value format as `v-click`,
  so you can ask the room to predict the output first

JavaScript and TypeScript run out of the box. Other languages need a runner: either a
`setup/code-runners.ts` file, or an addon (for example `slidev-addon-cpp-runner`, which
compiles C/C++ in the browser and takes its compiler flags from the headmatter).

⚠️ Runnable blocks load Monaco and are heavy. A handful per deck, not one per example.
Use `{monaco-run}` only when *running or editing it live* is the actual point; plain
fenced blocks for syntax, comparisons, and fragments.

## Magic move

Morphs one version of the code into the next, per click. **Four** backticks around blocks
of three:

`````md
````md magic-move {at:4, lines:true, duration:500} [counter.js]
```js {*|1}
let count = 1
function add() {
  count++
}
```
```js
const add = () => count += 1
```
````
`````

Prose between the inner blocks is ignored, so you can leave comments there. The filename in
brackets renders a title bar with an auto-matched file icon. Line highlighting works inside
each step.

This is the best tool for refactoring narratives — showing how code becomes other code —
because the unchanged tokens stay put and the eye follows only what moved.

## Code groups

Tabbed alternatives. Requires `comark: true` in the headmatter.

````md
::code-group

```sh [npm]
npm i @slidev/cli
```

```sh [pnpm]
pnpm add @slidev/cli
```

::
````

Tab titles auto-match icons for known package managers, frameworks, config files, and
extensions (install `@iconify-json/vscode-icons`). Force one with `~icon~` in the title:
```` ```js [GitHub ~i-uil:github~] ```` — install that collection and add the icon to
`safelist` in `uno.config.ts`.

## Imported snippets

Keep long code out of the slide file:

```md
<<< @/snippets/example.c
<<< @/snippets/example.c#region-name
<<< @/snippets/example.c c {2,3|5}{lines:true}
<<< @/snippets/example.c c {monaco}{height:200px}
```

`@` is the package root; `#region-name` pulls a VS Code `#region` block. Keep them in
`@/snippets` so Monaco resolves them.

The advantage: the snippet is a real file that compiles and gets linted, so it can't rot
into an example that doesn't build.

## Twoslash

```` ```ts twoslash ```` renders inline type information from the TypeScript compiler —
hovers, errors, and `// ^?` queries. Controlled by the `twoslash` headmatter option
(default on).

## Deck-wide settings

In the headmatter: `lineNumbers: true`, `monaco: true | 'dev' | 'build'`,
`monacoTypesSource: 'local' | 'cdn' | 'none'`, `codeCopy`, and the Shiki config
(themes and languages).

## Guidance for teaching decks

- Show complete, compilable programs in runnable blocks — students copy them verbatim, so
  a missing `#include` or a warning becomes their problem.
- Prefer highlighting steps (`{1|2-4|all}`) over revealing a wall of code at once; the
  highlight tells the room where to look without you pointing.
- Keep a block under ~15 lines. Past that, import a snippet with `maxHeight` and highlight
  the region that matters.

## Related skills

`cpp-runner` for running C/C++ specifically, `slide-theming` for adding a code runner for another language.
