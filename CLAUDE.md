# Programming Fundamentals Lecția — Project Guide

## 1. What this is

A **Slidev-based presentation system** for a university-level *Fundamentele Programării*
course (programming fundamentals in **C**), taught in Romanian to first-year students with
no prior programming experience.

- Slidev v52 + Vue 3.5, pnpm workspaces — one workspace per lesson deck
- Neversink theme, **blue-light** colour scheme
- `slidev-addon-cpp-runner` — C/C++ compiled and run inside the slide

Generic Slidev and Neversink reference material lives in `.claude/skills/` (see §11). This
file covers only what is true of **this repository** and the rules that always apply.

## 2. Language convention — CRITICAL

- ✅ All educational content, explanations and instructions in **Romanian**
- ✅ Code comments in Romanian, for educational clarity
- ✅ All technical terms in **English** — never translate them

**Never translate**: array, pointer, string, struct, enum, header, compiler, linker,
debugger, loop, `if`, `else`, `switch`, `while`, `for`, `break`, `continue`, `return`,
stack, heap, buffer, overflow, scope, cast, segmentation fault, `int`, `char`, `float`,
`double`, `void`, `size_t`, `unsigned`, `printf`, `scanf`, `malloc`, `free`, `fopen`,
`strlen`, `stdin`, `stdout`.

````markdown
## De ce indexarea începe de la 0?

Numele unui array este adresa primului element. Indexul este **offset-ul** față
de acea adresă — primul element este la distanța 0.

```c
int note[3] = {8, 9, 10};
printf("%d\n", note[0]);  // 8 — primul element, offset 0
```
````

## 3. Slide titles — CRITICAL

**A slide title contains only the title. Nothing else.**

- ❌ `# Lecția 5` / `## Tablouri` / `# Lecția 5: Tablouri` / `# Lecția 5 — Tablouri`
- ✅ `# Tablouri (Arrays) în C` / `# Problema Stocării Multiplelor Valori`

No lesson number, no `Lecția N` prefix, no numbering of any kind in a visible heading — the
number already appears in the hub grid and in the navigation.

The numbered form (`Lecția 5: Tablouri`) belongs **only** in `common/lessons.json` and in
the generated frontmatter `title` / `info`, which drive the browser tab and the hub card.

## 4. Slide conventions

- ✅ `color: blue-light` and `align: c` on every content slide
- ✅ `layout: top-title` for most content slides
- ❌ **No `v-click` / `v-clicks`** — show content directly

```markdown
---
layout: top-title
color: blue-light
align: c
---

:: title ::

# Tablouri (Arrays) în C

:: content ::

Un array este o zonă **continuă** de memorie care ține mai multe valori de
același tip.
```

⚠️ `align` arity differs per layout: `top-title` takes one letter (`align: c`), but
`top-title-two-cols` and `two-cols-title` need three parts (`align: c-lt-lt`). Passing
`align: c` there renders a red *"invalid layout params"* slide. See the `slide-layouts`
skill.

## 5. Repository layout

```
programming-fundamentals-lab/
├── slides/                    # one independent deck per lesson
│   ├── 00-hub/                # landing page / table of contents (port 3030)
│   ├── 01-intro/              (port 3031)
│   └── …                      # up to 15-project (port 3045)
├── common/                    # shared across every deck
│   ├── lessons.json              # ⭐ single source of truth for the lesson structure
│   ├── lessons.ts                # navigation logic between decks
│   ├── components/            # shared Vue components (auto-imported everywhere)
│   ├── setup/main.ts          # theme mixin + markdown globals
│   ├── theme/                 # colour scheme and shared styles
│   ├── vite/                  # multiPublicPlugin
│   └── public/                # shared assets
├── scripts/                   # dev orchestration, build, headmatter sync
└── README.md                  # quick start (Romanian)
```

Each `slides/*` is an independent pnpm workspace (`@programming-fundamentals-lab/<name>`)
with its own `package.json`, `vite.config.ts`, `setup/main.ts` and dev port.

### Why one deck per lesson

Every lesson is a separate Slidev app rather than one deck stitched together with `src:`
includes. Slide numbering is then local to a lesson (adding a slide to lesson 2 cannot
shift the links in lesson 7), each dev server only reloads its own file, and a lesson can
be presented on its own.

The cost: cross-deck links are real navigations. In dev they point at `localhost:<port>` —
**the deck you navigate to must be running**; in a build they are paths under a shared
base. `common/lessons.ts` (`deckUrl`) is the only place that knows the difference.

### `common/lessons.json` is the single source of truth ⭐

Lesson number, slug, port, module, icon, title and description all live in this one file.
`scripts/*.mjs` read it at build time; `common/lessons.ts` reads it at runtime. The hub
grid, the prev/next `<DeckNav>` and the generated deck titles all derive from it.

**Never hardcode** a lesson title, port or neighbour link in a deck — edit the registry.

## 6. Headmatter is generated

Slidev cannot include headmatter, so every deck repeats `theme`, `addons`, the shiki config
and the cpp-runner compiler flags in full. `scripts/sync-headmatter.mjs` owns that
repetition:

```yaml
---
title: 'FP · Lecția 5: Tablouri'   # generated from common/lessons.json
info: '…'                          # generated from common/lessons.json
layout: cover                      # ← the deck's own half, edit freely
color: blue-light
# == shared: generated by scripts/sync-headmatter.mjs — do not edit below ==
theme: neversink                   # ← regenerated on every run, edits are lost
transition: slide-left
c: { compiler: 'g++', standard: 'c2x', … }
cpp: { compiler: 'g++', standard: 'c++17', … }
---
```

To change a compiler flag, the theme or an addon **for the whole course**, edit `SHARED` in
`scripts/sync-headmatter.mjs`, then run `pnpm sync-headmatter`.
`node scripts/sync-headmatter.mjs --check` exits non-zero if any deck is stale.

⚠️ Never put `---` inside the headmatter, not even in a YAML comment — Slidev silently
truncates it there. See the `slide-deck-config` skill for the full failure mode.

## 7. Shared components

In `common/components/`, auto-imported in every deck — **no import needed** in slides:

| Component | What it does |
|---|---|
| `<LessonGrid />` | Grid of all lessons, grouped by module (used by the hub) |
| `<LessonCard slug="08-arrays" />` | A single card in that grid |
| `<DeckNav />` | End-of-deck navigation: previous lesson / hub / next lesson |
| `<HomeButton />` | 🏠 back to the hub; rendered on every slide via `global-bottom.vue` |
| `<GithubLink />` | Repository link icon (repo URL comes from `lessons.json`) |
| `<SlideBottom />` | Page counter footer; rendered via each deck's `slide-bottom.vue` |

They are wired in through each deck's `vite.config.ts`, which adds `common/components` to
Slidev's auto-import dirs. **That directory entry is load-bearing** — registering a shared
component globally in `setup/main.ts` is not enough, and it fails as a bogus "Icon not
found" error. See the `slide-components` skill.

⚠️ Slidev **spreads** `slidev.components` over its own options, so a `dirs` array
*replaces* its default list rather than extending it — dropping the builtins (`<Toc/>`,
`<Link/>`), the theme's components (`<Admonition/>`, `<SpeechBubble/>`, the Kawaii
characters) and the deck's own `components/`. It fails **silently**: Vue renders the
unresolved tag as a plain HTML element, so a `<SpeechBubble>` shows its text with no
bubble around it. `common/vite/component-dirs.ts` rebuilds the full list —
`componentDirs(import.meta.dirname)`; never hand-write `dirs` in a deck.

Deck-local components go in `slides/<deck>/components/`. Neversink components
(`<AdmonitionType>`, `<StickyNote>`, …) are available everywhere.

## 8. Code in slides

**C by default** — the course teaches C. Fenced blocks are `c`; the headmatter targets
`g++` with `-std=c2x`.

⚠️ `{monaco-run}` blocks compile **remotely, via Coliru** — they need a live network
connection at presentation time. Never let a runnable block carry a point you must land;
keep the expected output visible too. See the `cpp-runner` skill.

- ✅ Use `{monaco-run}` only when *running and editing it live* is the point
- ✅ Plain ` ```c ` blocks for syntax, comparisons and short fragments
- ⚠️ Runnable blocks load Monaco — a handful per deck, not every example
- ✅ Complete, compilable programs in runnable blocks: `#include`, `main`, `return 0`
- ✅ Romanian in comments and in `printf` output strings
- ❌ Never leave a compile warning in an example — students copy them verbatim

## 9. Workflows

### Adding a lesson

1. Add the entry to `common/lessons.json` — number, slug, port, module, icon, title,
   description. Leave `status` off until the deck is written; it then shows as a *schelet*
   in the hub grid.
2. Create `slides/<slug>/` with `slides.md`, copying `package.json`, `vite.config.ts`,
   `setup/main.ts`, `global-bottom.vue` and `slide-bottom.vue` from a neighbouring deck
   (adjust the package name and port).
3. Add a `dev:<slug>` script to the root `package.json`.
4. `pnpm install` (registers the workspace), then `pnpm sync-headmatter`.

The deck then appears in the hub grid and in prev/next navigation automatically.

### Development

```bash
pnpm install

pnpm dev                        # all decks (mprocs TUI if installed)
pnpm dev --lazy                 # only the hub; start the rest from the mprocs UI
node scripts/dev.mjs hub 5 6    # only the hub and lessons 5 and 6
pnpm dev:hub                    # a single deck
pnpm dev:08-arrays
```

Ports: `3030` hub, `3030 + lesson number` for lessons. Cross-deck links point at
`localhost:<port>` in dev, so the deck you navigate to must be running.

Editing `slides.md` or a component hot-reloads; `vite.config.ts` needs a restart.

The lesson currently being taught is `currentLesson` (a slug) in `common/theme/config.ts` —
earlier lessons show ✅ in the hub grid, this one ▶️.

> **Node**: on Node 25 the global `localStorage` breaks a transitive Slidev dependency at
> import time; `scripts/node-compat.mjs` applies the workaround to every spawned process.

### Build & deploy

```bash
pnpm build                                   # everything into dist/
node scripts/build.mjs --only 08-arrays      # rebuild a single deck in place
BASE_PATH=/programming-fundamentals-lab pnpm build
pnpm preview
```

The hub builds to `dist/`, each lesson to `dist/<slug>/`. `scripts/fix-spa-routing.mjs`
then gives every deck a `404.html` copy of its own `index.html` and writes a root
dispatcher, so deep links like `/08-arrays/12` survive on static hosts.

GitHub Pages serves the site from a repository subpath — `.github/workflows/deploy.yml`
passes it through `BASE_PATH`. That is the only deploy target; another static host needs
the same per-deck SPA fallback, which the generated `404.html` files provide.

## 10. Troubleshooting

**Theme is `@slidev/theme-default`, every layout "Unknown"** — the headmatter was
truncated by a `---` inside it (§6). Fix it and run `pnpm sync-headmatter`.

**A component renders as plain text, unstyled, with no error** — its directory is missing
from the deck's auto-import `dirs` (§7). Use `componentDirs()`; don't override `dirs`.

**"Icon `xx/…` not found" for a component you wrote** — unplugin-icons claimed the tag.
Make sure the component's directory is in the deck's `slidev.components.dirs` (§7).

**"Entry file … does not exist"** — a dev server still points at an old deck path after a
rename. Kill it and restart, then `pnpm install` to relink the workspace.

**Renaming a deck** touches more than the directory: `common/lessons.json` (`slug`), the
deck's `package.json` (`name`), the root `package.json` (`dev:*` script),
`common/theme/config.ts` (`currentLesson`), `README.md` — then `pnpm install` and
`pnpm sync-headmatter`.

**Port already in use** — decks use `strictPort`, so this fails loudly on purpose (a
shifted port would silently break every cross-deck link). `lsof -ti:3035 | xargs kill`.

**Compiler warnings in runnable blocks** — `fix-cpp-runner.sh` patches `-Wno-format…`
into the addon's own `COMMON_FLAGS` on every `pnpm install`, because the addon reads its
`c:` / `cpp:` config from the **current slide's** frontmatter — and headmatter is only
slide 1's frontmatter, so settings there never reach the rest of the deck. Putting the
config under `defaults:` may remove the need for the patch entirely; untested. See the
`cpp-runner` skill.

## 11. Reference

Slidev and Neversink reference material is in `.claude/skills/`, loaded on demand:

| Skill | For |
|---|---|
| `slide-layouts` | layouts, slots, columns, the `align` notation, colour schemes |
| `slide-components` | Neversink and Slidev components, icons, `v-mark`, `ns-c-*` classes |
| `slide-code-blocks` | highlighting, Monaco, `monaco-run`, magic-move, snippets |
| `cpp-runner` | the C/C++ runner addon: Coliru backend, compiler flags, config scope |
| `slide-diagrams` | Mermaid (with examples per diagram type), PlantUML, LaTeX |
| `slide-presenting` | presenter mode, notes, drawing, timer, export, hosting |
| `slide-theming` | setup hooks, custom layouts/components, styles, UnoCSS, addons |
| `slide-deck-config` | headmatter/frontmatter options, directory structure, CLI |

Upstream: [Slidev](https://sli.dev/) ·
[Neversink](https://gureckis.github.io/slidev-theme-neversink/) ·
[cpp-runner addon](https://github.com/kzhu2099/slidev-addon-cpp-runner)

---

## Quick checklist ✅

- [ ] Slide content in **Romanian**, technical terms in **English**
- [ ] Slide titles carry **only the title** — no `Lecția N`, no numbering
- [ ] `color: blue-light` and `align: c` on every content slide
- [ ] No `v-click` / `v-clicks`
- [ ] Runnable C examples compile clean and are complete programs
- [ ] Lesson metadata changed in `common/lessons.json`, not in the deck
- [ ] Shared headmatter changed in `scripts/sync-headmatter.mjs`, then `pnpm sync-headmatter`
