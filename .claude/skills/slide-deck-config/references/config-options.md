# Configuration reference

## Headmatter — deck-level

Defaults shown.

```yaml
theme: default              # theme id, package name, or local path
addons: []
title: Slidev               # inferred from the first header if unset
titleTemplate: '%s - Slidev'
info: false                 # may be a Markdown string
author: Your Name Here
keywords: keyword1,keyword2

presenter: true             # boolean | 'dev' | 'build'
browserExporter: dev
download: false             # or a custom URL
exportFilename: slidev-exported
export:
  format: pdf
  timeout: 30000
  dark: false
  withClicks: false
  withToc: false

twoslash: true
lineNumbers: false
monaco: true                # boolean | 'dev' | 'build'
monacoTypesSource: local    # 'cdn' | 'local' | 'none'
monacoTypesAdditionalPackages: []
monacoRunAdditionalDeps: []
remoteAssets: false
selectable: true
record: dev
contextMenu: true
wakeLock: true
pwa: false
overviewSnapshots: false
routerMode: history         # 'history' | 'hash' | 'memory'
mcp: true                   # false disables the /__mcp endpoint

colorSchema: auto           # 'auto' | 'light' | 'dark'
aspectRatio: 16/9
canvasWidth: 980
transition: undefined
clickAnimation: undefined   # comma-delimited preset names
themeConfig:
  primary: '#5d8392'

favicon: 'https://cdn.jsdelivr.net/gh/slidevjs/slidev/assets/favicon.png'
plantUmlServer: https://www.plantuml.com/plantuml
fonts:
  sans: Roboto
  serif: Roboto Slab
  mono: Fira Code

defaults:                   # frontmatter merged into every slide
  layout: default

drawings:
  enabled: true
  persist: false
  presenterOnly: false
  syncAll: true

htmlAttrs:
  dir: ltr
  lang: en

seoMeta:
  ogTitle: …
  ogDescription: …
  ogImage: …
  ogUrl: …
  twitterCard: summary_large_image
  twitterTitle: …
  twitterDescription: …
  twitterImage: …
  twitterSite: username
  twitterUrl: …
```

Opt-in flags: `comark: true` (Comark/MDC syntax, required for `::code-group`), `codeCopy`,
`magicMoveCopy`, and per-theme keys such as Neversink's `neversink_slug`.

## Per-slide frontmatter

```yaml
clicks: 0                   # override the auto-computed click count
clicksStart: 0
background: undefined       # URL, local path, color, or gradient
disabled: false             # `hide:` is an alias
hideInToc: false
layout: default             # 'cover' on the first slide
class: undefined            # string | string[] | Record<string, unknown>
level: 1                    # heading level for <Toc> / <TitleRenderer>
preload: true
routeAlias: undefined
src: undefined              # include another markdown file
title: undefined
transition: undefined
clickAnimation: undefined
zoom: 1
dragPos: {}                 # written by v-drag; don't hand-edit
```

Theme layouts add their own: Neversink contributes `color`, `align`, `columns`,
`titlewidth`, `titlepos`, `side`, `margin`, `author`, `quotesize`, `authorsize`, `speed`,
`loop`, `neversink_slug`, `slide_info`.

## Slide transitions

`fade`, `fade-out`, `slide-left`, `slide-right`, `slide-up`, `slide-down`,
`view-transition` (experimental), or a custom name backed by CSS on the Vue transition
classes. Direction-specific with a pipe: `transition: go-forward | go-backward`.

## Setup hooks

Files under `setup/`, each a default-exported `defineX` call:

| File | Configures |
|---|---|
| `main.ts` | the Vue app (plugins, global components, mixins) |
| `code-runners.ts` | custom languages for `{monaco-run}` |
| `shiki.ts` | highlighter themes and languages |
| `mermaid.ts` | Mermaid defaults |
| `katex.ts` | KaTeX options |
| `monaco.ts` | Monaco editor |
| `shortcuts.ts` | keyboard shortcuts |
| `context-menu.ts` | right-click menu entries |
| `routes.ts` | extra routes |
| `transformers.ts` | Markdown transformers |

## Global context

Available in components and in slide expressions: `$slidev`, `$nav` (`currentPage`,
`currentLayout`, `total`, `next`, `prev`, `isPresenter`), `$clicks`, `$page`,
`$renderContext` (`slide` | `overview` | `presenter` | `previewNext`), `$frontmatter`.
