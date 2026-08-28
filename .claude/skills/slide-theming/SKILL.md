---
name: slide-theming
description: Extend and style Slidev — setup hooks (main.ts, shiki, mermaid, katex, monaco, code-runners, shortcuts, transformers, routes), custom layouts and components, slide-scoped styles, UnoCSS and fonts, the global context ($nav, $clicks, $slidev), slide lifecycle hooks, ejecting a theme, and writing a theme or addon. Use when customizing styles, adding a setup hook, writing a layout/component/theme/addon, or configuring Vite/UnoCSS for a deck.
---

# Theming and extending a deck

## Directory conventions

```
your-deck/
├── components/     # auto-imported by PascalCase filename
├── layouts/        # filename = layout name; overrides a theme layout of the same name
├── public/         # static assets, served from /
├── setup/          # hooks, see below
├── snippets/       # code imported with <<<
├── styles/         # index.ts importing your CSS
├── index.html      # injected into head/body
└── vite.config.ts
```

All optional, all auto-detected.

## Setup hooks

Each file default-exports a `defineX` call:

| File | Configures |
|---|---|
| `setup/main.ts` | the Vue app — plugins, global components, mixins |
| `setup/shiki.ts` | highlighter themes and languages |
| `setup/code-runners.ts` | custom languages for `{monaco-run}` |
| `setup/monaco.ts` | the Monaco editor |
| `setup/mermaid.ts` | Mermaid defaults |
| `setup/katex.ts` | KaTeX options |
| `setup/shortcuts.ts` | keyboard shortcuts |
| `setup/context-menu.ts` | right-click menu entries |
| `setup/routes.ts` | extra routes |
| `setup/transformers.ts` | Markdown transformers |
| `setup/preparser.ts` | custom slide syntax, before parsing |

A code runner is the extension point behind addons like `slidev-addon-cpp-runner`:

```ts
// setup/code-runners.ts
import { defineCodeRunnersSetup } from '@slidev/types'

export default defineCodeRunnersSetup(() => ({
  async python(code, ctx) {
    return { text: await runSomewhere(code), highlightLang: 'ansi' }
  },
}))
```

The return value is `{ text, html, element, highlightLang, class }` — anything you can
render below the editor.

## Styles

`styles/index.ts` imports your CSS; everything runs through UnoCSS and PostCSS, so nesting
and `--uno:` directives work:

```css
.slidev-layout {
  --uno: px-14 py-10 text-[1.1rem];
  pre, code { --uno: select-text; }
  a { color: theme('colors.primary'); }
}
```

⚠️ **Global CSS also styles the presenter UI.** Scope selectors under `.slidev-layout`
(`.slidev-layout .grid`, never bare `.grid`) or they leak into the presenter view.

### Slide-scoped styles

A `<style>` tag inside a slide applies to that slide only:

```md
# This is red

<style>
h1 { color: red; }
</style>
```

It is always *scoped* in the Vue sense, so a child combinator (`.a > .b`) does not work as
written — for that, use the global stylesheet.

### Targeting specific slides and directions

`.slidev-page-7` targets slide 7; `.slidev-layout.my-layout` targets a layout. Navigation
direction adds `.slidev-nav-go-forward` / `.slidev-nav-go-backward` to the container, and
UnoCSS exposes them as the `forward:` and `backward:` variants:

```html
<div v-click class="transition forward:delay-300">Element</div>
```

### Fonts

```yaml
fonts:
  sans: Roboto
  serif: Roboto Slab
  mono: Fira Code
```

Auto-imported from Google Fonts. A theme may also expose CSS variables to override
instead — Neversink uses `--neversink-title-font`, `--neversink-main-font`,
`--neversink-mono-font`, `--neversink-quote-font`.

## Sizing

```yaml
aspectRatio: 16/9     # deck-wide canvas
canvasWidth: 980
```

Per slide, `zoom: 0.8` scales one crowded slide. For a single element, `<Transform
:scale="0.5" origin="top center">` scales without disturbing the rest of the layout. Reach
for them in that order — canvas, slide, element — from broadest to narrowest.

## Writing a component

A `.vue` file in `components/` is auto-imported by its PascalCase filename.

```vue
<script setup>
import { onSlideEnter, onSlideLeave, useIsSlideActive } from '@slidev/client'

const isActive = useIsSlideActive()
onSlideEnter((to, from) => { /* slide became active */ })
onSlideLeave((to, from) => { /* slide became inactive */ })
</script>
```

⚠️ **`onMounted` and `onUnmounted` do not fire per visit.** Slide components are kept alive
when inactive, so use `onSlideEnter` / `onSlideLeave` for anything that should run each
time the slide is shown — starting an animation, resetting state, playing audio.

### Global context

Available in components and slide expressions:

| | |
|---|---|
| `$slidev` | the whole context object |
| `$nav` | `currentPage`, `currentLayout`, `total`, `next()`, `prev()`, `go()`, `isPresenter` |
| `$clicks` | current click count on this slide |
| `$page` | this slide's number |
| `$frontmatter` | this slide's frontmatter |
| `$renderContext` | `slide` \| `overview` \| `presenter` \| `previewNext` |

`$renderContext` is how a component behaves differently in the presenter view or the
overview grid — or use `<RenderWhen context="presenter">`.

## Writing a layout

A `.vue` file in `layouts/`; the filename is the layout name. Use Vue slots, which slide
authors fill with `::name::`:

```vue
<template>
  <div class="slidev-layout my-layout">
    <div class="title"><slot name="title" /></div>
    <div class="body"><slot /></div>
  </div>
</template>
```

Keep the `.slidev-layout` class — theme and global styles hang off it.

⚠️ **A local `layouts/` file shadows the theme's layout of the same name.** Useful
deliberately, confusing accidentally.

## Ejecting a theme

```bash
slidev theme eject          # copies the current theme into ./theme
```

Rewrites the headmatter to `theme: ./theme`. Full control, at the cost of no longer getting
upstream fixes. Prefer overriding a layout or a CSS variable first; eject when you're
forking the theme in earnest (and credit the original).

## Themes and addons

Both are npm packages or local paths:

```yaml
theme: neversink
addons:
  - slidev-addon-cpp-runner
  - ./local-addon
```

A **theme** provides layouts, styles, and components, and only one applies. An **addon**
provides the same kinds of files but composes — several can be active, and they can't set
the theme. Write either by publishing a package with `layouts/`, `components/`, `styles/`,
`setup/` in the same conventional shape as a deck.

Precedence, highest first: your project's files → addons (in order) → the theme.

## Tooling config

`vite.config.ts` extends Vite; the `slidev` key inside it configures Slidev's own plugins:

```ts
export default {
  slidev: {
    components: { dirs: ['./components', '../common/components'] },
    markdown: { /* markdown-it options */ },
  },
}
```

⚠️ **Adding a directory to `components.dirs` is the only reliable way to register shared
components across decks.** Registering globally in `setup/main.ts` is not enough and fails
as a spurious "Icon not found" error — see `slide-components`.

`uno.config.ts` extends UnoCSS: shortcuts, safelist (needed for dynamically-named icons),
theme colors, and rules.

## Formatting

Slidev's syntax confuses Prettier's Markdown parser. `prettier-plugin-slidev` fixes it:

```bash
pnpm add -D prettier prettier-plugin-slidev
```

then activate it in the Prettier config. `slidev format` separately tidies the file's
structure — separators and frontmatter — but not the slide content.
