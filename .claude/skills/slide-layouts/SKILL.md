---
name: slide-layouts
description: Choose and configure a slide layout — every Slidev built-in layout (cover, center, two-cols, image-left, section, quote, fact, iframe…) and every Neversink layout (top-title, top-title-two-cols, two-cols-title, side-title, four-cell, credits) with its slots, props, the 12-unit column system, the align notation, margins, and color schemes. Use when picking a layout, splitting a slide into columns, or a slide renders as an "invalid layout params" error.
---

# Slide layouts

A layout is chosen per slide with `layout:` in that slide's frontmatter. Layouts expose
named slots, filled with the `::name::` sugar:

```md
---
layout: two-cols
---

Content of the default slot

::right::

Content of the right slot
```

⚠️ **Always leave a blank line after a `::name::` marker.** Markdown directly on the next
line is not parsed — this is the single most common cause of a slide rendering as raw text.

## Neversink layouts

| Layout | Slots | Props (all also take `color`) |
|---|---|---|
| `cover` | `:: note ::` | — |
| `intro` | `:: note ::` | — |
| `default` | content | `margin` |
| `full` | content | `margin` |
| `section` | content | `margin` |
| `top-title` | `:: title ::`, `:: content ::` | `align` (1 letter), `margin` |
| `top-title-two-cols` | `:: title ::`, `:: left ::`, `:: right ::` | `columns`, `align` (3 parts), `margin` |
| `two-cols-title` | `:: title ::`, `:: left ::`, `:: right ::` | `columns`, `align` (3 parts), `titlepos`, `margin` |
| `two-cols` | `:: left ::`, `:: right ::` | `columns`, `align` |
| `side-title` | `:: title ::`, `:: content ::` | `side`, `titlewidth`, `align` (2 parts), `margin` |
| `four-cell` | `:: top-left ::`, `:: top-right ::`, `:: bottom-left ::`, `:: bottom-right ::` | `rowheight`, `colwidth`, `align` |
| `quote` | content | `author`, `quotesize` (`text-2xl`), `authorsize` (`text-l`) |
| `credits` | content | `speed` (0.5), `loop` (false) |

`titlepos` on `two-cols-title` is `t` (default), `b`, or `n` (no title).
`side` on `side-title` is `l` (default) or `r`.

Default `color` is `white` on `cover`, `intro`, `default`, `full`, `two-cols-title`;
`light` on `section`, `quote`, `top-title`, `top-title-two-cols`, `side-title`.

### The 12-unit column system

Content splits into 12 units. `columns: is-N` gives the left column N and the right `12-N`.

| Left:Right | Names |
|---|---|
| 1:11 | `is-1`, `is-1-11`, `is-one-twelfth` |
| 2:10 | `is-2`, `is-2-10`, `is-one-sixth` |
| 3:9 | `is-3`, `is-3-9`, `is-one-quarter` |
| 4:8 | `is-4`, `is-4-8`, `is-one-third` |
| 5:7 | `is-5`, `is-5-7` |
| 6:6 | `is-6`, `is-6-6`, `is-one-half`, `is-half`, `is-two-quarters`, `is-two-fourths` |
| 7:5 | `is-7`, `is-7-5` |
| 8:4 | `is-8`, `is-8-4`, `is-two-thirds` |
| 9:3 | `is-9`, `is-9-3`, `is-three-quarters` |
| 10:2 | `is-10`, `is-10-2` |
| 11:1 | `is-11`, `is-11-1` |

Default `is-one-half`. `side-title` uses the same vocabulary in `titlewidth`
(default `is-one-third`).

### The align notation — arity is per layout

**Passing the wrong number of segments renders a red "invalid layout params" slide instead
of the content.** This is silent at build time.

| Layout | Form | Example | Default |
|---|---|---|---|
| `top-title` | one letter, horizontal only | `align: c` | `l` |
| `top-title-two-cols` | `title-left-right` | `align: c-lt-lt` | `l-lt-lt` |
| `two-cols-title` | `title-left-right` | `align: l-lm-rt` | `l-lt-lt` |
| `side-title` | `column-column` | `align: rm-lt` | `auto` |
| `four-cell` | `align` | — | — |

Each column segment is a horizontal letter (`l` / `c` / `r`) followed by a vertical one
(`t` / `m` / `b`). The **title** segment takes the horizontal letter only — it occupies a
narrow band.

For `side-title`, the segments map to *columns*, not to title-then-content: with `side: r`
the title is the right column, so the second segment styles it. `auto` resolves to `rm-lt`
when `side: l` and `lt-lm` when `side: r`.

### Margins

`margin: normal | tight | tighter | none` — supported on `default`, `full`, `section`,
`top-title`, `top-title-two-cols`, `side-title`, `two-cols-title`.

| Value | Top padding | Side padding |
|---|---|---|
| `normal` | 1.8rem | default |
| `tight` | 0.8rem | 1.5rem |
| `tighter` | 0.4rem | 1rem |
| `none` | 0 | 0 |

Equivalent classes for a single element: `ns-c-tight-margin`, `ns-c-tighter-margin`,
`ns-c-no-margin`.

Use `tight` for one extra bullet, `tighter` for data-heavy slides and large tables, `none`
for full-bleed images and hand-positioned content.

### Color schemes

`color:` accepts a Neversink scheme. They come in monochromatic pairs — `-light` is a pale
background with saturated text, the plain name is the inverse.

- Neutral: `black`, `white`, `dark`, `light`, `navy`, `navy-light`
- Every Tailwind hue in both variants: `red`, `orange`, `amber`, `yellow`, `lime`, `green`,
  `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `pink`, `rose`,
  `fuchsia`, `slate`, `gray`, `zinc`, `neutral`, `stone` — e.g. `stone-light`, `sky`

Each scheme sets `--neversink-bg-color`, `--neversink-fg-color`, `--neversink-text-color`,
`--neversink-border-color`, `--neversink-highlight-color`, `--neversink-bg-code-color`,
`--neversink-fg-code-color`. Apply one to any element with a scheme class plus a binding
class:

```html
<div class="neversink-red-scheme ns-c-bind-scheme">red box</div>
<div class="ns-c-sk-scheme ns-c-bind-scheme">same thing, short alias</div>
```

Aliases use the hue's **first two letters**: `ns-c-pi-scheme` (pink), `ns-c-bl-lt-scheme`
(blue-light), plus `ns-c-bk-`, `ns-c-wh-`, `ns-c-dk-`, `ns-c-lt-`, `ns-c-nv-`, `ns-c-nv-lt-`.

With `colorSchema: auto` in the headmatter, schemes adapt to dark mode automatically and
`d` toggles it.

## Slidev built-in layouts

Available in any theme that doesn't override them.

| Layout | Purpose | Frontmatter |
|---|---|---|
| `default` | plain content | — |
| `center` | content centered on screen | — |
| `cover` | title page (auto-applied to slide 1) | — |
| `intro` | title, description, author | — |
| `section` | start of a new section | — |
| `statement` | a single affirmation | — |
| `fact` | one fact or number, prominent | — |
| `quote` | a quotation | — |
| `full` | uses the whole screen | — |
| `end` | final slide | — |
| `none` | no styling at all | — |
| `two-cols` | side by side, `::right::` slot | — |
| `two-cols-header` | full-width header, then two columns; `::left::`, `::right::` | — |
| `image` | image as the content | `image:` |
| `image-left` / `image-right` | image one side, content the other | `image:`, `class:` |
| `iframe` | a web page as the content | `url:` |
| `iframe-left` / `iframe-right` | web page one side, content the other | `url:`, `class:` |

## Slot mechanics

`::name::` is sugar for `<template v-slot:name>`. You can name `::default::` explicitly and
put slots in any order:

```md
---
layout: two-cols
---

::right::

# Right (written first)

::default::

# Left
```

## Writing your own layout

Drop a `.vue` file in `layouts/` at the project root; the filename becomes the layout name.
Slidev picks it up automatically, and a local layout overrides a theme layout of the same
name.

## Related skills

`slide-components` for what goes inside a layout, `slide-theming` for writing your own layout, slide-scoped styles, and `zoom` / `Transform` sizing.
