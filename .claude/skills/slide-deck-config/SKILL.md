---
name: slide-deck-config
description: Configure and ship a slide deck — headmatter and per-slide frontmatter options with defaults, slide separators and notes, project directory structure, styles and fonts, splitting a deck across files with src, the slidev CLI (dev, build, export to PDF/PNG/PPTX), and hosting. Use when setting up a deck, changing a deck-wide setting, splitting or importing slides, or building and exporting.
---

# Deck setup, configuration, and export

## Anatomy of a slides file

`---` padded with blank lines separates slides. The **first** frontmatter block is the
*headmatter* and configures the whole deck; every later one configures its own slide.

```md
---
theme: neversink
title: My Deck
---

# Slide 1

---
layout: center
background: /bg.png
---

# Slide 2

<!-- This comment is the presenter note for slide 2 -->
```

A comment block **at the end** of a slide is the presenter note; Markdown and HTML inside
it render. A comment anywhere else is just a comment.

⚠️ **Never let a bare `---` appear inside the headmatter**, not even in a YAML comment.
Slidev ends the block at the first one *without erroring*: every key below is silently
dropped, the theme falls back to `@slidev/theme-default`, and the build dies with a wall of
"Unknown layout" warnings. If that's the symptom, this is almost always the cause.

**Block frontmatter** is the alternative: a fenced `yaml` block at the very start of a
slide's content acts as its frontmatter, and keeps editor highlighting and formatting. It
does not work for the headmatter.

## Configuration

The full option lists with defaults are in `references/config-options.md`. The ones that
come up most:

| Option | Notes |
|---|---|
| `theme`, `addons` | package name or local path |
| `title`, `info`, `author` | drive the browser tab and exports |
| `colorSchema` | `auto` \| `light` \| `dark`; `auto` lets `d` toggle |
| `aspectRatio`, `canvasWidth` | `16/9` and `980` by default |
| `lineNumbers`, `monaco`, `twoslash` | code block behavior |
| `transition`, `clickAnimation` | deck-wide animation defaults |
| `fonts` | auto-imported from Google Fonts |
| `defaults` | frontmatter applied to every slide |
| `mcp` | `false` disables the MCP endpoint |
| `comark` | `true` enables Comark/MDC syntax and `::code-group` |

Per slide, the common ones are `layout`, `class`, `background`, `clicks`, `transition`,
`zoom`, `routeAlias`, `hide`, `hideInToc`, `src`.

## Directory structure

```
your-deck/
├── components/     # auto-imported Vue components
├── layouts/        # custom layouts, filename = layout name
├── public/         # static assets, served from /
├── setup/          # hooks: main.ts, code-runners.ts, shiki.ts, mermaid.ts…
├── snippets/       # code imported with <<<
├── styles/         # index.ts importing your CSS
├── index.html      # injected into the page head/body
├── slides.md
└── vite.config.ts
```

All optional. Styles go through UnoCSS and PostCSS, so nesting and `--uno:` directives work:

```css
.slidev-layout {
  --uno: px-14 py-10 text-[1.1rem];
  pre, code { --uno: select-text; }
}
```

⚠️ Global CSS also applies to the **presenter UI**. Scope selectors under `.slidev-layout`
(`.slidev-layout .grid`, not `.grid`) or they leak.

Theme fonts, if the theme exposes CSS vars, are overridden in your own stylesheet — for
Neversink: `--neversink-title-font`, `--neversink-main-font`, `--neversink-mono-font`,
`--neversink-quote-font`.

## Splitting a deck

`src:` in a frontmatter-only slide pulls in another file:

```md
---
src: ./pages/intro.md
---

---
src: ./pages/chapter-1.md#2,5-7
---
```

The hash selects specific slides. When both files set the same key, **the main entry
wins** — so you can override a layout or class at the point of import.

This keeps slide numbering local to each file, which matters: a slide added to chapter 1
would otherwise shift every link in chapter 7.

## Persistent UI

`global-top.vue`, `global-bottom.vue` (one instance), `slide-top.vue`, `slide-bottom.vue`
(one per slide), `custom-nav-controls.vue` — all at the project root, auto-detected.
Z-order top to bottom: nav controls, global top, slide top, content, slide bottom, global
bottom.

## CLI

```bash
slidev [entry]                 # dev server
slidev build [entry]           # static SPA
slidev export [entry]          # PDF/PNG/PPTX/MD
slidev format [entry]          # tidy the file structure, not the slide content
slidev mcp [entry]             # stdio MCP server
slidev theme eject [entry]     # copy the theme into ./theme for editing
```

Dev options: `--port -p`, `--base`, `--open -o`, `--remote [password]`, `--bind`, `--log`,
`--force -f`, `--theme -t`.
Build options: `--out -o`, `--base`, `--download`, `--without-notes`, `--theme -t`.
Export options: `--output`, `--format pdf|png|pptx|md`, `--timeout`, `--range '1,4-5,6'`,
`--dark`, `--with-clicks -c`, `--omit-background`, `--per-slide`.

Two gotchas: `npx slidev` does not work (the package is `@slidev/cli`), and with npm
scripts options need `--` first: `npm run slidev -- --remote --port 8080`.

Export `--with-clicks` produces one page per animation step — necessary if your handout has
to show what the audience saw, and a large page count if you forget it's on.

## Hosting

`slidev build` emits a static SPA. Two things travel with it:

- `--base` must match the subpath when hosting under one (GitHub Pages project sites), or
  every asset link breaks.
- The SPA needs a per-deck fallback so deep links like `/deck/12` survive a hard refresh —
  a `404.html` copy of `index.html` on GitHub Pages, or the host's rewrite rule elsewhere.

## References

- `references/config-options.md` — every headmatter and per-slide option with its default

## Related skills

`slide-presenting` for presenter mode, export, and hosting; `slide-theming` for setup hooks, styles, and custom layouts.
