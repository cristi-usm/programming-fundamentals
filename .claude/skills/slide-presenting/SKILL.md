---
name: slide-presenting
description: Present, export, and share a deck — presenter mode and its layouts, keyboard shortcuts, the overview and notes editors, presenter notes and click markers, the drawing/annotation tools, camera and recording, remote access and tunnels, the timer, exporting to PDF/PPTX/PNG, and hosting the built SPA. Use when preparing to present, writing speaker notes, exporting a handout, or publishing a deck.
---

# Presenting, exporting, and hosting

## Keyboard and navigation

| Key | Action |
|---|---|
| `right` / `space` | next animation or slide |
| `left` | previous animation or slide |
| `up` / `down` | previous / next **slide** (skipping clicks) |
| `f` | fullscreen |
| `o` | quick overview — a grid of all slides, click to jump |
| `d` | toggle dark mode |
| `g` | go to slide number |

The navigation bar appears at the bottom left on mouse-over, and also holds camera view,
recording, presenter mode, the integrated editor, the browser exporter, PDF download, and
deck info. Shortcuts are remappable in `setup/shortcuts.ts`; the bar itself is extensible
via `custom-nav-controls.vue`.

## Presenter mode

At `http://localhost:<port>/presenter`, or the speaker icon in the nav bar.

Open **two windows**: play mode on the shared screen, presenter mode on yours. Navigation
in the presenter window syncs every other connected instance automatically.

Three presenter layouts cycle with the layout toggle — slide-on-top (default), notes-left,
and a larger next-slide preview. **Screen mirror** replaces the main slide area with a
captured monitor or window, which is what you want during a live demo: you see what the
projector is actually showing.

Two more editing surfaces:

- `/overview` — every slide in a linear list with notes alongside; notes are editable by
  double-click, and the click sliders let you preview animation steps
- `/notes-edit` — all speaker notes in one text area, slides separated by
  `--- #[slide-number]` markers, autosaved

## Speaker notes

A comment block **at the end** of a slide is its note; Markdown and HTML render.

```md
# Slide title

Content.

<!--
A note, with **markdown**.
-->
```

For long notes, `[click]` markers split them so the presenter view highlights and
auto-scrolls to the right paragraph as you advance:

```md
<!--
Before the first click.

[click] Highlighted after the first click.

- [click] Highlighted after the second click.

[click:3] Skips ahead to click 3.
-->
```

`notesAutoRuby` in the headmatter maps words to ruby annotations globally — a
pronunciation aid for notes in Japanese and similar scripts.

## Drawing and annotation

Powered by drauu; the pen icon opens the toolbar, also available in presenter mode.
Drawings sync live across all connected instances. A stylus is detected automatically —
you can draw with the pen while your finger still navigates, without toggling a mode.

```yaml
drawings:
  enabled: true       # or 'dev' | false
  persist: false      # true → saved as SVG under .slidev/drawings, kept in exports
  presenterOnly: false
  syncAll: true       # false → only the presenter's drawings propagate
```

`persist: true` is what makes annotations survive into the exported PDF and the hosted
site. `syncAll: false` matters when the audience has the URL — otherwise anyone can draw
on your slides.

## Camera and recording

The avatar button overlays your camera on the slides (draggable, resizable, position
persists). The video button records — camera embedded in the slides, or slides and camera
as two separate files. Powered by RecordRTC and the WebRTC API.

## Remote access

```bash
slidev --remote                    # listen on the network
slidev --remote=your_password      # presenter mode requires the password
slidev --remote --tunnel           # Cloudflare quick tunnel, public URL
```

Without a password, anyone on the network can open `/presenter` and drive your deck. Set
one whenever you share the URL.

## Timer

```yaml
duration: 30min      # default
timer: stopwatch     # or 'countdown'
```

Shows in presenter mode with a progress bar; start, pause, and reset from there.

## Exporting

**Browser exporter** (recommended): the export button in the nav bar, or
`http://localhost:<port>/export`. Exports PDF, or captures images into PPTX or a zip.
Needs a modern Chromium-based browser.

**CLI**: requires Playwright in the project.

```bash
pnpm add -D playwright-chromium
slidev export                       # → ./slides-export.pdf
slidev export --format pptx
slidev export --format png
slidev export --format md
```

Options: `--output`, `--range '1,4-5,6'`, `--dark`, `--with-clicks -c`,
`--omit-background`, `--timeout`, `--per-slide`.

Things that bite:

- `--with-clicks` emits **one page per animation step**. Off by default for PDF, but **on
  by default for PPTX** — pass `--with-clicks false` to disable it there.
- PPTX slides are exported as **images**, so text isn't selectable. Notes do carry over,
  per slide.
- Interactive content (Monaco, runnable code, iframes, videos) is dead in any export. If
  interactivity matters, host the deck instead.
- If `global-top.vue` / `global-bottom.vue` depend on navigation state, export with
  `--per-slide` so each page gets the right state — or use the per-slide layers.

### Offering a PDF from the built deck

```yaml
download: true                        # generates the PDF at build time + a download button
download: 'https://host/talk.pdf'     # or point at an existing file, skipping rendering
```

Also `slidev build --download`. Export options come from the headmatter `export:` block.

## Hosting

`slidev build` emits a static SPA into `dist/`.

- `--base` must match the subpath when hosting under one (a GitHub Pages project site), or
  every asset URL breaks.
- The SPA needs a fallback so deep links like `/12` survive a refresh — a `404.html` copy
  of `index.html` on GitHub Pages, or the host's rewrite rule.
- `--without-notes` strips speaker notes from the published bundle. Worth remembering
  before publishing notes written for yourself.

### Offline

```yaml
pwa: true      # or 'build' | 'dev'
```

Generates a service worker that precaches every asset, so a loaded deck runs with no
network. Requires `vite-plugin-pwa` (an optional peer dependency — the CLI offers to
install it on first use). Off by default because precaching everything is heavy; the case
for it is exactly the conference-wifi scenario.

Note this does **not** save a `cpp-runner` block: that compiles remotely and still needs
the network.

## Sharing metadata

```yaml
seoMeta:
  ogTitle: …
  ogDescription: …
  ogImage: auto       # capture slide 1 via Playwright → ./og-image.png
  ogUrl: https://example.com
  twitterCard: summary_large_image
```

A local `./og-image.png` is picked up automatically with no config. `ogImage: auto`
generates one from the first slide — commit the result to avoid regenerating it on CI.

## Assets

Local assets go in `public/` and are referenced with a **leading slash** (`/pic.png`, not
`./pic.png`). Remote images are cached to disk on first run when `remoteAssets` is enabled,
so a flaky network at presentation time doesn't blank your images.
