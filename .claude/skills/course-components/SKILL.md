---
name: course-components
description: The course's own shared components in common/components/ — <Definition> (definition cards), <Chip> (pills with a logo), <AxisMap> (2D quadrant map), <LogoWall> (logo collage), <MemoryCells> (memory strip), <LessonGrid>/<LessonCard>, <DeckNav>, <HomeButton>, <GithubLink>, <SlideBottom> — their props, the slide patterns they belong in, the icon registry, and how to add a new shared component. Use when putting a definition, a language/tool logo, a comparison diagram, a memory drawing, or a lesson grid on a slide, or when writing a new component for common/components/.
---

# Course components

Everything in `common/components/` is auto-imported in every deck — **no import needed** in
slides. This file documents the components we wrote. Neversink's and Slidev's own
components are in the `slide-components` skill.

| Component | What it does |
|---|---|
| `<Definition term="…" source="…" [emphasis] [color] />` | Definition card — eyebrow, attribution, text |
| `<Chip [icon] [emphasis] [color]>C</Chip>` | Pill with an auto-resolved logo |
| `<AxisMap :items :zones x-label y-label … />` | 2D map: two axes crossing, four named zones |
| `<LogoWall :names [dir] [size] [dim] />` | Collage of logos from `public/icons/` |
| `<MemoryCells :cells [caption] [size] />` | Strip of memory boxes: name, content, address |
| `<FlowSteps :steps [caption] [size] />` | Horizontal pipeline: labelled nodes + animated arrows |
| `<LessonGrid />` | Grid of all lessons, grouped by module (used by the hub) |
| `<LessonCard slug="08-arrays" />` | A single card in that grid |
| `<DeckNav />` | End-of-deck navigation: previous lesson / hub / next lesson |
| `<HomeButton />` | 🏠 back to the hub; rendered on every slide via `global-bottom.vue` |
| `<GithubLink />` | Repository link icon (repo URL comes from `lessons.json`) |
| `<SlideBottom />` | Page counter footer; rendered via each deck's `slide-bottom.vue` |

---

## `<Definition>`

Definitions recur across the whole course, so they get one component rather than a
hand-rolled box per slide.

| Prop | Default | |
|---|---|---|
| `term` | `''` | The word being defined. Eyebrow, top left |
| `source` | `''` | Where it comes from — `DEX`, `Standardul C`, `Pe scurt` |
| `emphasis` | `false` | The version to remember: tinted fill, `1.9rem` semibold text, wider rail |
| `color` | `blue-light` | Neversink scheme for the accents |

### The pattern: quote it, then restate it

Two slides, one definition each. First what the source says, then what it means in our
words — the `emphasis` card is the one students should walk away with.

```markdown
---
layout: top-title
align: c
color: blue-light
---

:: title ::

# Ce Spune Dicționarul

:: content ::

<div class="max-w-4xl mx-auto mt-10">

<Definition term="Programare" source="DEX">

- Acțiunea de a programa și rezultatul ei.
- Alcătuire a unei succesiuni de instrucțiuni care permit unui calculator să
  rezolve o problemă dată, plecând de la datele inițiale.

</Definition>

</div>

---
layout: top-title
align: c
color: blue-light
---

:: title ::

# Ce Înseamnă Pe Scurt

:: content ::

<div class="max-w-4xl mx-auto mt-10">

<Definition term="Programare" source="Pe scurt" emphasis>

A face computerul să execute exact ce vrem noi — **fără greșeli**, de fiecare dată.

</Definition>

</div>
```

- ✅ **One definition per slide** — never two cards stacked with an arrow between them
- ✅ The `max-w-4xl mx-auto` wrapper — a full-width card gives unreadably long lines
- ✅ An external definition is **quoted accurately and attributed**. Write `DEX` on the
  badge only if the text is really DEX's; a paraphrase is `Pe scurt`, not `DEX`
- ✅ Several senses → a markdown list in the slot; the component styles the markers
- ❌ DEX's `♦` sense separator — it means nothing to a first-year student, use a list
- ❌ A second `emphasis` card on the same slide; emphasis only works against a quiet one

### Why it looks the way it does

The card is white with one saturated rail, and the body text **inherits** the slide's
near-black colour. Tinting body text with `--neversink-text-color` on a
`--neversink-admon-bg-color` fill puts the 500 and 100 shades of one hue together, which
reads as decoration rather than prose — that was the first version, and it was unreadable
from the back of the room.

`emphasis` moves five properties at once (fill, size, weight, rail width, shadow). A
one-property difference reads as a rendering accident, not a hierarchy.

---

## `<Chip>`

A pill for one item in a list — a language, a tool, a file extension.

```markdown
<Chip>Python</Chip>                  <!-- finds its own logo from the slot text -->
<Chip icon="c" emphasis>C</Chip>     <!-- filled: the one that matters here -->
<Chip :icon="false">MATLAB</Chip>    <!-- plain pill, no logo -->
```

The icon is resolved from `icon-registry.ts` by the `icon` prop, or by the chip's own
text when that prop is absent. Anything not in the registry renders as a plain pill with
no empty gap, so chips work for things that have no logo (SQL, MATLAB, `.h`).

⚠️ Self-resolution reads the slot's **plain text** only. A chip wrapping bold or a link
finds nothing — pass `icon` explicitly there.

---

## `<AxisMap>`

A 2D map for "this one is more X and less Y than that one": languages by level and typing,
data structures by lookup and insert cost, editors by power and learning curve.

```markdown
<AxisMap
  y-label="Nivel" y-min="jos" y-max="înalt"
  x-label="Tipare" x-min="dinamic" x-max="strict"
  :zones="[
    'abstract · verificat la rulare',
    'abstract · verificat la compilare',
    'aproape de mașină · verificat la compilare',
    'aproape de mașină · fără verificări',
  ]"
  :height="400"
  :items="[
    { x: 26, y: 16, label: 'Assembly', icon: false },
    { x: 58, y: 20, label: 'C', highlight: true },
    { x: 30, y: 90, label: 'Python' },
  ]"
/>
```

`items` take `x`/`y` in 0–100 with the origin bottom-left, so the axes cross at (50, 50).
Each item renders as a `<Chip>` — label and logo always travel together. `zones` runs from
the top-left, **clockwise**.

- ✅ Write the four zones as **parallel phrases naming both axes**, so each corner explains
  itself (`abstract · verificat la rulare`)
- ✅ `highlight` the one language the slide is about — usually C
- ✅ Keep items out of the four corner bands, where the zone captions live
- ❌ A legend under the map explaining the axes — the axes get their own slide before it
- ❌ Reading the coordinates as data: placement is editorial, and worth saying so in class

It is plain HTML, not SVG. Axis names and end captions sit in a gutter **outside** the plot,
so no item can ever collide with the frame; that is a structural guarantee, not tuning.

---

## `<LogoWall>`

A collage, for "there are far more of these than we can cover".

```markdown
<LogoWall :size="52" :names="['python', 'rust', 'go', 'haskell']" />
<LogoWall dir="tools" :size="44" :names="['vscode', 'clion', 'neovim']" />
```

Files come from `common/public/icons/<dir>/<name>.svg`, checked into the repository. `dim`
fades the wall back when it is a backdrop rather than the subject.

---

## `<MemoryCells>`

A strip of memory: name above the box, address below, content inside.

```markdown
<MemoryCells
  :cells="[
    { addr: '…04', value: '8', name: 'nota', highlight: true },
    { addr: '…08', value: '?' },
  ]"
  caption="numele este al vostru — procesorul lucrează doar cu adresa"
/>
```

`value` is free text, so `?`, `\0` and `garbage` all work — which is what the arrays,
strings and dynamic-memory lessons need.

The strip sits on a "RAM" board (`label` prop, default `RAM`) with faded `⋯`
half-cells at both ends (`:continues="false"` to disable) and a small legend —
the drawing says memory continues beyond the window shown.

- ✅ Elided addresses (`…04`), not invented full ones — a concrete `0x7ffd04` invites
  students to think the number is meaningful or reproducible
- ✅ Keep the stride consistent with the type being drawn (4 apart for an `int`)

---

## `<FlowSteps>`

A horizontal pipeline for any transformation: source → compiler → executable, the
four compile stages, input → program → output. Nodes rise in staggered, arrows are
dashed lines whose dashes drift toward the head — the one authored motion on these
slides.

```markdown
<FlowSteps :size="1.1" :steps="[
  { label: 'hello.c', sub: 'text scris de om', kind: 'file' },
  { label: 'compiler (gcc)', sub: 'traducere', emphasis: true },
  { label: 'hello', sub: 'cod mașină', kind: 'file', highlight: true },
]" caption="…" />
```

- `kind`: `'stage'` (process, rounded box — the default) or `'file'` (artifact:
  monospace, folded document corner)
- `sub` sits above the node (who/what), `note` below it
- `via` puts the **action on the arrow** leading into a node (`via: 'Linking'`),
  with `viaNote` as a small caption under that arrow (`+ biblioteci`). Prefer
  artifacts as nodes and processes as `via` labels — the compile pipeline reads
  as files being transformed, not as ten boxes
- `emphasis` = the step the slide is about; `highlight` = the result worth noticing
- Shrink `size` (rem) for long pipelines
- ✅ One flow per slide; it *is* the diagram, not an illustration beside one
- ❌ Hand-rolled `div → div` rows or emoji arrows — this component replaces them

---

## Icons

Two sources, deliberately:

| | Where | Used by |
|---|---|---|
| Inlined at build | `~icons/logos/*` imports in `common/components/icon-registry.ts` | `<Chip>`, `<AxisMap>` |
| Tracked SVG files | `common/public/icons/{languages,tools}/` | `<LogoWall>`, any `<img>` |

Both are local: **nothing is fetched at presentation time**. Add a language to the registry
with one import plus one entry keyed by its lowercased name; add a wall logo by dropping an
SVG in the folder. Assembly is deliberately absent from both — the `logos` set has no
assembly mark, and WebAssembly is a different thing, so it renders as a labelled dot.

`<LogoWall>` builds its paths from `import.meta.env.BASE_URL`; a hardcoded `/icons/…` would
404 under the GitHub Pages subpath.

---

## Adding a shared component

1. Write it in `common/components/<Name>.vue`. Style it with the `--neversink-*` variables
   (`--neversink-border-color`, `--neversink-admon-bg-color`, `--neversink-text-color`, …)
   rather than fixed colours, so it follows whatever `color` scheme the deck sets and picks
   up dark mode for free. Take a `color` prop defaulting to `blue-light` and bind
   `neversink-${color}-scheme` on the root element to make that work.
2. Use `:deep()` for markdown that arrives through the slot, and reset `p` margins — slot
   markdown comes wrapped in `<p>` tags that will otherwise blow the layout apart.
3. Document it in the table above.

No registration step: `common/components` is already in every deck's auto-import dirs.

⚠️ It fails **silently** if the dirs are wrong — Vue renders an unresolved component as a
plain HTML element, so the tag's text shows up unstyled instead of raising an error. Decks
must build their auto-import dirs with `componentDirs()` from `common/vite/component-dirs.ts`;
see §7 of `CLAUDE.md`.
