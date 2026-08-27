# Programming Fundamentals Lecția — Project Guide

## 1. Project Introduction & Purpose

This is a **Slidev-based presentation system** for a university-level
*Fundamentele Programării* course (programming fundamentals in **C**), taught in
Romanian.

### Key Characteristics

- **Target audience**: first-year Romanian university students, no prior programming experience assumed
- **Content language**: **all presentation slides must be written in Romanian**
- **Technical terms**: always kept in English (array, pointer, string, compiler, loop, …)
- **Tech stack**:
  - Slidev v52 (presentation framework, Vue 3)
  - Vue 3.5 (interactive components)
  - pnpm workspaces (monorepo, one workspace per deck)
  - Neversink theme (**stone-light** colour scheme)
  - `slidev-addon-cpp-runner` — C/C++ code compiled and run inside the slide

## 2. Project Structure

```
programming-fundamentals-lab/
├── slides/                    # one independent deck per lesson
│   ├── 00-hub/                # landing page / table of contents (port 3030)
│   ├── 01-intro/              (port 3031)
│   ├── 02-data-types/         (port 3032)
│   └── …                      # up to 15-project (port 3045)
├── common/                    # shared across every deck
│   ├── lessons.json              # ⭐ single source of truth for the lesson structure
│   ├── lessons.ts                # navigation logic between decks
│   ├── components/            # shared Vue components (auto-imported everywhere)
│   ├── setup/main.ts          # theme mixin + markdown globals
│   ├── theme/                 # colour scheme and shared styles
│   ├── vite/                  # multiPublicPlugin
│   └── public/                # shared assets (C.png, github.svg)
├── scripts/                   # dev orchestration, build, headmatter sync
└── README.md                  # quick start (Romanian)
```

Each `slides/*` directory is an independent pnpm workspace with its own
`package.json` (`@programming-fundamentals-lab/<name>`), `vite.config.ts`,
`setup/main.ts` and dedicated dev port.

### Why one deck per lesson

Every lesson is a separate Slidev app rather than one deck stitched together with
`src:` includes. Slide numbering is then local to a lesson (adding a slide to lesson 2
cannot shift the links in lesson 7), each dev server only reloads its own file, and
a lesson can be presented on its own.

The cost: cross-deck links are real navigations. In dev they point at
`localhost:<port>` — **the deck you navigate to must be running**; in a build
they are paths under a shared base. `common/lessons.ts` (`deckUrl`) is the only
place that knows the difference.

### `common/lessons.json` is the single source of truth ⭐

Lecția number, slug, port, module, icon, title and description all live in this one
file. `scripts/*.mjs` read it at build time; `common/lessons.ts` reads it at
runtime. The hub grid, the prev/next `<DeckNav>` and the generated deck titles
are all derived from it.

**Never hardcode** a lesson title, port or neighbour link in a deck — edit the
registry instead.

## 3. Language Convention — CRITICAL

When creating or editing slides:

- ✅ **DO** write all educational content, explanations and instructions in **Romanian**
- ✅ **DO** keep all technical terms in **English**
- ✅ **DO** write code comments in Romanian, for educational clarity
- ❌ **DON'T** translate C / programming terminology

**Terms to NEVER translate**:

- Language: array, pointer, string, struct, enum, header, compiler, linker, debugger
- Constructs: loop, `if`, `else`, `switch`, `while`, `for`, `break`, `continue`, `return`
- Concepts: stack, heap, buffer, overflow, scope, cast, overflow, segmentation fault
- Types: `int`, `char`, `float`, `double`, `void`, `size_t`, `unsigned`
- Library: `printf`, `scanf`, `malloc`, `free`, `fopen`, `strlen`, `stdin`, `stdout`

**Example of correct slide content**:

````markdown
## De ce indexarea începe de la 0?

Numele unui array este adresa primului element. Indexul este **offset-ul** față
de acea adresă — primul element este la distanța 0.

```c
int note[3] = {8, 9, 10};
printf("%d\n", note[0]);  // 8 — primul element, offset 0
```
````

## 4. Slide Titles — CRITICAL

**Slide titles contain only the title. Nothing else.**

- ❌ `# Lecția 5` / `## Tablouri`
- ❌ `# Lecția 5: Tablouri`
- ❌ `# Lecția 5 — Tablouri`
- ✅ `# Tablouri (Arrays) în C`
- ✅ `# Problema Stocării Multiplelor Valori`

No lesson number, no `Lecția N` prefix, no numbering of any kind in the visible
heading — the number already appears in the hub grid and in the navigation.

The numbered form (`Lecția 5: Tablouri`) belongs **only** in `common/lessons.json`
(`title`) and in the deck's frontmatter `title` / `info`, which drive the browser
tab and the hub card — not the slides themselves.

## 5. Slide Structure & Frontmatter

### Headmatter is generated — do not hand-edit the shared half ⚠️

Slidev cannot include headmatter, so every deck repeats `theme`, `addons`, the
shiki config and the cpp-runner compiler flags in full.
`scripts/sync-headmatter.mjs` owns that repetition:

```yaml
---
title: 'FP · Lecția 5: Tablouri'     # generated from common/lessons.json
info: '…'                          # generated from common/lessons.json
layout: cover                      # ← the deck's own half, edit freely
color: stone-light
# == shared: generated by scripts/sync-headmatter.mjs — do not edit below ==
theme: neversink                   # ← regenerated on every run, edits are lost
transition: slide-left
…
c: { compiler: 'g++', standard: 'c2x', … }
cpp: { compiler: 'g++', standard: 'c++17', … }
---
```

To change a compiler flag, the theme or an addon for the whole course, edit
`SHARED` in `scripts/sync-headmatter.mjs`, then:

```bash
pnpm sync-headmatter
```

`node scripts/sync-headmatter.mjs --check` exits non-zero if any deck is stale.

⚠️ **Never put `---` inside the headmatter**, not even in a YAML comment. Slidev
ends the block at the first such run *without erroring*: every key below it is
silently dropped, the theme falls back to `@slidev/theme-default`, and the build
dies with a wall of `Unknown layout "top-title"` warnings.

### Slide layout

**Common layouts**: `cover`, `top-title` (with `:: title ::` / `:: content ::`),
`center`, `two-cols` (`:: left ::` / `:: right ::`), `section`, `full`.

- ✅ **ALWAYS include** `color: stone-light` and `align: c` on content slides
- ✅ Use `layout: top-title` for most content slides
- ❌ **DON'T use** `v-click` / `v-clicks` animations — show content directly

⚠️ **`align` is layout-specific.** `top-title` takes a single letter (`align: c`),
but the two-column layouts (`top-title-two-cols`, `two-cols-title`) need **three
parts** — title, left, right — e.g. `align: c-lt-lt` (first letter `c`/`l`/`r`,
second `t`/`m`/`b` for vertical). Passing `align: c` there renders a red
*"invalid layout params"* slide instead of the content. Those layouts also accept
`columns` (`is-7-5`, `is-one-half`, …).

```markdown
---
layout: top-title
color: stone-light
align: c
---

:: title ::

# Tablouri (Arrays) în C

:: content ::

Un array este o zonă **continuă** de memorie care ține mai multe valori de
același tip.
```

## 6. Shared Components

Living in `common/components/`, auto-imported in every deck — **no import needed**
in slides:

| Component | What it does |
|---|---|
| `<LessonGrid />` | Grid of all lessons, grouped by module (used by the hub) |
| `<LessonCard slug="08-arrays" />` | A single card in that grid |
| `<DeckNav />` | End-of-deck navigation: previous lesson / hub / next lesson |
| `<HomeButton />` | 🏠 back to the hub; rendered on every slide via `global-bottom.vue` |
| `<GithubLink />` | Repository link icon (repo URL comes from `lessons.json`) |
| `<SlideBottom />` | Page counter footer; rendered via each deck's `slide-bottom.vue` |

They are wired in through each deck's `vite.config.ts`, which adds
`common/components` to Slidev's auto-import dirs.

⚠️ **Registering a shared component globally in `setup/main.ts` is not enough**,
and this fails in a confusing way. The full `@iconify/json` set is installed, so
unplugin-icons claims any unknown PascalCase tag whose kebab-case form starts
with a collection prefix: `<LessonGrid/>` becomes the icon `la/b-grid` (`la` = Line
Awesome) and the build fails with *"Icon `la/b-grid` not found"*. A component
found in an auto-import **directory** is resolved before any resolver, so adding
the directory is the fix — not renaming the component.

Deck-local components go in `slides/<deck>/components/` and are auto-imported by
Slidev the same way (PascalCase filename → `<ComponentName />`).

Theme components from neversink (`<AdmonitionType type="tip">`, `<Admonition>`,
`<StickyNote>`, …) are available everywhere.

## 7. Code in Slides

**C by default** — the course teaches C. Fenced blocks are `c`; the compiler
config in the headmatter targets `g++` with `-std=c2x`.

Runnable examples use the cpp-runner addon:

````markdown
```c {monaco-run}
#include <stdio.h>

int main(void) {
    int note[3] = {8, 9, 10};
    for (int i = 0; i < 3; i++) {
        printf("Nota %d: %d\n", i + 1, note[i]);
    }
    return 0;
}
```
````

- ✅ Use `{monaco-run}` when *running and editing it live* is the point
- ✅ Use plain `” ```c ”` blocks for syntax, comparisons and short fragments
- ⚠️ Runnable blocks are heavy (they load Monaco) — a handful per deck, not every example
- ✅ Complete, compilable programs in runnable blocks: `#include`, `main`, `return 0`
- ✅ Romanian in comments and in `printf` output strings
- ❌ Never leave a compile warning in an example — students copy them verbatim

## 8. Adding a Lecția

1. Add the entry to `common/lessons.json` — number, slug, port, module, icon, title,
   description. Leave `status` off until the deck is written; it then shows as a
   *schelet* in the hub grid.
2. Create `slides/<slug>/` with `slides.md`, and copy `package.json`,
   `vite.config.ts`, `setup/main.ts`, `global-bottom.vue` and `slide-bottom.vue`
   from a neighbouring deck (adjust the package name and port).
3. Add a `dev:<slug>` script to the root `package.json`.
4. `pnpm install` (registers the new workspace), then `pnpm sync-headmatter`.

The deck appears in the hub grid and in prev/next navigation automatically,
because everything derives from the registry.

## 9. Development Workflow

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

The lesson currently being taught is set in `common/theme/config.ts` (`currentLesson`,
a slug) — earlier lessons show ✅ in the hub grid, this one ▶️.

> **Node**: on Node 25 the global `localStorage` breaks a transitive Slidev
> dependency at import time; `scripts/node-compat.mjs` applies the workaround to
> every spawned process automatically.

## 10. Build & Deploy

```bash
pnpm build                                   # everything into dist/
node scripts/build.mjs --only 08-arrays      # rebuild a single deck in place
BASE_PATH=/programming-fundamentals-lab pnpm build
pnpm preview
```

The hub builds to `dist/`, each lesson to `dist/<slug>/`. `scripts/fix-spa-routing.mjs`
then gives every deck a `404.html` copy of its own `index.html` and writes a root
dispatcher, so deep links like `/08-arrays/12` survive on static hosts.

GitHub Pages serves the site from a repository subpath — the workflow in
`.github/workflows/deploy.yml` passes it through `BASE_PATH`. That is the only
deploy target; a different static host needs the same per-deck SPA fallback,
which the generated `404.html` files already provide.

## 11. Troubleshooting

**Theme is `@slidev/theme-default`, every layout "Unknown"** — the headmatter was
truncated. Look for `---` inside it (§5) and run `pnpm sync-headmatter`.

**"Icon `xx/…` not found" for a component you wrote** — unplugin-icons claimed the
tag (§6). Make sure the component's directory is in the deck's
`slidev.components.dirs`.

**"Entry file … does not exist"** — a dev server is still pointing at an old deck
path after a rename. Kill it and restart; `pnpm install` afterwards to relink the
workspace.

**Renaming a deck** touches more than the directory: `common/lessons.json` (`slug`),
the deck's `package.json` (`name`), the root `package.json` (`dev:*` script),
`common/theme/config.ts` (`currentLesson`), `README.md`, then `pnpm install` and
`pnpm sync-headmatter`.

**Port already in use** — the decks use `strictPort`, so this fails loudly on
purpose (a shifted port would silently break every cross-deck link).
`lsof -ti:3035 | xargs kill`.

**Compiler warnings in runnable blocks** — the addon hardcodes its own flag list;
`fix-cpp-runner.sh` patches `-Wno-format…` in on every `pnpm install`.

## 12. References

- Slidev — https://sli.dev/
- Neversink theme — https://github.com/smallfish-xy/slidev-theme-neversink
- cpp-runner addon — https://github.com/kzhu2099/slidev-addon-cpp-runner

---

## Quick Checklist ✅

- [ ] Slide content in **Romanian**, technical terms in **English**
- [ ] Slide titles carry **only the title** — no `Lecția N`, no numbering
- [ ] `color: stone-light` and `align: c` on every content slide
- [ ] No `v-click` / `v-clicks`
- [ ] Runnable C examples compile clean and are complete programs
- [ ] Lecția metadata changed in `common/lessons.json`, not in the deck
- [ ] Shared headmatter changed in `scripts/sync-headmatter.mjs`, then `pnpm sync-headmatter`
