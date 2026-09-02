---
name: slide-components
description: Use components inside slides — Slidev built-ins (Toc, Link, Arrow, AutoFitText, SlidevVideo, Youtube, Transform, RenderWhen, LightOrDark, VDrag), Neversink components (Admonition, StickyNote, SpeechBubble, Box, QRCode, Thumb, Line, Kawaii, CreditScroll), Iconify icons, the ns-c-* utility classes, draggable positioning, and writing your own component. Use when adding a callout, note, icon, QR code, video, arrow, or any Vue component to a slide.
---

# Components in slides

Vue components work directly in slide Markdown, with no import. Anything in
`components/` at the project root is auto-registered, as are the theme's and any addon's.

⚠️ Markdown inside an HTML or component tag needs a **blank line before and after it**,
otherwise it is not parsed:

```md
<div class="something">

Make this **bold**.

</div>
```

## Callouts and notes

```vue
<Admonition title="Info" color="teal-light" width="300px">
Content here.
</Admonition>

<AdmonitionType type="warning" width="300px">
Type-driven colors and icon.
</AdmonitionType>
```

`Admonition` props: `title` (default `Note`), `color` (default `amber-light`), `width`
(`100%`), `icon` (`mdi-information-variant-circle-outline`), `custom`, `customTitle`.
`AdmonitionType` props: `type` — `info` | `important` | `tip` | `warning` | `caution` —
and `width`.

```vue
<StickyNote color="amber-light" width="180px" title="Reminder" devOnly>
Hidden from builds and exports.
</StickyNote>
```

`StickyNote` props: `title`, `color` (`amber-light`), `width` (`180px`), `textAlign`
(`left`), `custom`, `customTitle`, `devOnly`. `devOnly` is the useful one — presenter
reminders that never reach the published deck.

```vue
<SpeechBubble position="r" color="sky" shape="round" maxWidth="300px">
Hello, I'm a **speech bubble**.
</SpeechBubble>
```

`SpeechBubble` props: `position` (`t`/`b`/`l`/`r`/`tl`/`tr`/`bl`/`br`, default `b`),
`shape` (`''`/`round`/`circle`), `animation` (`''`/`pop`/`float`), `color` (`red-light`),
`textAlign`, `maxWidth`, `borderWidth`.

⚠️ `color` is a **scheme name**, not a CSS color: it becomes the class
`neversink-<color>-scheme`. A `-light` scheme fills the bubble with the 100 shade, so
`color="blue-light"` reads on a white slide; a raw hex silently produces no scheme class
and leaves the bubble unstyled. (The Kawaii characters are the opposite — their `color`
*is* a hex.)

**In this course**, a question put to the class is always a centred `SpeechBubble` on
`layout: center` — see §4 of `CLAUDE.md` for the exact block and the rules around it.

## Shapes and annotations

| Component | Key props |
|---|---|
| `<Box>` | `shape` (`s\|r\|f`-`s\|d\|o`-radius-opacity, default `s-s-2-100`), `size` (`150px`), `color`, `custom`; default slot renders text inside |
| `<Line>` | `:x1 :y1 :x2 :y2` required, `:width` (2), `color` |
| `<Arrow>` | `x1 y1 x2 y2` required, `width` (2), `color`, `two-way` |
| `<ArrowDraw>` | `color`, `width` (140px) — hand-drawn arrow |
| `<ArrowHeads>` | `color`, `width` — arrows converging on a point |
| `<Thumb>` | `dir` (`up`/`down`), `color`, `width` |
| `<VDragArrow>`, `<VDragLine>` | same props, positioned by dragging |

`Box`'s `shape` reads as shape-border-radius-opacity: `r-d-8-0` is rounded, dashed, 8px
radius, opaque fill. Opacity affects the fill only — use `custom` classes for the border.

## Content components

| Component | Purpose |
|---|---|
| `<QRCode value="…" :size="200" render-as="svg" />` | QR code without leaving the deck |
| `<Email v="name@example.com" />` | `mailto:` link with an icon |
| `<Toc :columns="2" :maxDepth="2" mode="onlySiblings" />` | table of contents from slide titles |
| `<Link to="12" title="Details" />` | jump to a slide by number or `routeAlias` |
| `<TitleRenderer no="5" />`, `<SlideCurrentNo />`, `<SlidesTotal />` | slide metadata |
| `<AutoFitText :max="100" :min="30">…` | shrinks text until it fits |
| `<Transform :scale="0.8" origin="top left">…` | scale anything that overflows |
| `<SlidevVideo controls autoplay="once" autoreset="slide">` | video that resets per slide |
| `<Youtube id="…" :width="600" />`, `<Tweet id="…" />`, `<BlueSky uri="…" />` | embeds |
| `<RenderWhen context="presenter">` | render only in a given context, with `#fallback` |
| `<LightOrDark>` with `#light` / `#dark` | swap assets by color scheme |
| `<CreditScroll speed="1.0" loop>` | scrolling movie-style credits |

Kawaii characters — `<IceCream>`, `<Backpack>`, `<Cat>`, `<Browser>`, `<Mug>`, `<Planet>`,
`<SpeechBubbleGuy>`, `<CreditCard>` — take `mood` (`sad`, `shocked`, `happy`, `blissful`,
`lovestruck`, `excited`, `ko`), `:size`, and `:color` as a hex code.

## Icons

Any Iconify set is a tag once its package is installed:

```md
<mdi-account-circle />
<carbon-badge class="text-3xl text-red-400" />
<logos-vue />
```

Install `@iconify-json/{collection}` — `mdi`, `carbon`, `logos`, `twemoji`, `uim`, `tabler`,
and so on. Browse at icones.js.org. Icons style like any element.

⚠️ **Icon resolution can hijack your own component.** unplugin-icons claims any unknown
PascalCase tag whose kebab-case form starts with a collection prefix — `<LessonGrid />`
becomes the icon `la/b-grid` and the build fails with "Icon not found". Registering the
component globally in `setup/main.ts` is *not* enough, because auto-import directories are
resolved before resolvers. The fix is to add the component's directory to
`slidev.components.dirs` in `vite.config.ts` — not to rename the component.

## Free positioning

Add `v-drag` to place a component anywhere by dragging; give it a fixed `width` /
`maxWidth` first.

```vue
<Admonition title="Aside" color="teal-light" width="300px" v-drag />
```

Double-click to start dragging, arrow keys to nudge, `Shift` to keep the aspect ratio,
click outside to stop. The position is written back into the slide's `dragPos` frontmatter —
don't hand-edit it.

`<v-drag pos="name">…</v-drag>` wraps arbitrary content. Height `_` (component) or `NaN`
(directive) means "fit the content".

## Utility classes

Neversink ships `ns-c-*` helpers:

| Class | Effect |
|---|---|
| `ns-c-bind-scheme` | apply the current color scheme to bg, text, border |
| `ns-c-tight`, `ns-c-verytight`, `ns-c-supertight` | closer bullet spacing |
| `ns-c-center-item` | center a block (`margin: auto`, `width: fit-content`) |
| `ns-c-fader` | fade earlier items as `v-clicks` advances |
| `ns-c-cite`, `ns-c-cite-bl` | small italic gray reference, optionally bottom-left |
| `ns-c-quote` | quote font and weight outside a quote layout |
| `ns-c-iconlink`, `ns-c-plainlink`, `ns-c-nounderline` | strip link underlines |
| `ns-c-tight-margin`, `ns-c-tighter-margin`, `ns-c-no-margin` | slide padding |

`==highlighted text==` renders a highlight in Markdown.

Everything else is UnoCSS/Tailwind utilities, usable directly in slide HTML.

## Persistent elements

Components that should appear on every slide go in a global layer at the project root:
`global-top.vue`, `global-bottom.vue` (one instance each), `slide-top.vue`,
`slide-bottom.vue` (one per slide), `custom-nav-controls.vue`. Use `$nav` to make them
conditional:

```vue
<template>
  <footer v-if="$nav.currentLayout !== 'cover'" class="absolute bottom-0 right-0 p-2">
    {{ $nav.currentPage }} / {{ $nav.total }}
  </footer>
</template>
```

Prefer the per-slide layers when exporting, or pass `--per-slide`, so each page gets the
right state.

## Marking and highlighting

`v-mark` draws a hand-drawn Rough Notation over an element:

```md
<span v-mark.underline.orange>underlined in orange</span>
<span v-mark.circle.red>circled</span>
<span v-mark="{ at: 5, color: '#234', type: 'box' }">explicit options</span>
```

Types: `underline` (default), `box`, `circle`, `highlight`, `strike-through`, `crossed-off`.
Colors are UnoCSS color names as modifiers, or `color:` in the object form. It behaves like
`v-click` — it triggers on a click and takes the same value format (`v-mark="'+1'"`), so
it can annotate something already on screen at the moment you talk about it.

## Writing your own

A `.vue` file in `components/` is auto-imported by its PascalCase filename. It has access
to the global context (`$slidev`, `$nav`, `$clicks`, `$page`, `$renderContext`), so a
component can react to clicks:

```vue
<script setup>
const props = defineProps({ label: String })
</script>

<template>
  <div v-if="$clicks > 2">{{ label }}</div>
</template>
```

## Related skills

`slide-layouts` for the layout each component sits in, `slide-theming` for writing your own
component and the slide lifecycle hooks (`onSlideEnter` rather than `onMounted`).
