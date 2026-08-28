# Mermaid flowcharts

The workhorse diagram. `flowchart` and `graph` are interchangeable; `flowchart` is current.

## Direction

`flowchart TD` (top-down, same as `TB`), `BT`, `LR` (left-right), `RL`.

On a 16:9 slide, `LR` usually fits better than `TD` — a tall diagram gets scaled down until
the labels are unreadable.

```mermaid
flowchart LR
  A[Input] --> B[Process] --> C[Output]
```

## Nodes and shapes

The id is what displays unless you give it text.

```mermaid
flowchart LR
  id1[Rectangle]
  id2(Rounded)
  id3([Stadium])
  id4[[Subroutine]]
  id5[(Database)]
  id6((Circle))
  id7>Asymmetric]
  id8{Decision}
  id9{{Hexagon}}
  id10[/Parallelogram/]
  id11[\Parallelogram alt\]
  id12[/Trapezoid\]
  id13[\Trapezoid alt/]
  id14(((Double circle)))
```

Quote the label when it contains punctuation, unicode, or reserved characters:

```mermaid
flowchart LR
  a["This ❤ works, even with (parens)"]
  b["`**Markdown** in a backtick string
  across lines`"]
```

The general shape syntax (Mermaid 11+) names a shape explicitly, which is more readable
than remembering bracket combinations:

```mermaid
flowchart TD
  A@{ shape: manual-input, label: "User types" }
  B@{ shape: doc, label: "Report" }
  C@{ shape: cyl, label: "Store" }
  A --> B --> C
```

Common shape names: `rect`, `rounded`, `stadium`, `subproc`, `cyl`, `circle`, `diam`,
`hex`, `lean-r`, `lean-l`, `trap-b`, `trap-t`, `dbl-circ`, `doc`, `docs`, `delay`,
`manual-input`, `manual-file`, `fork`, `collate`, `comment`, `bolt`, `das`, `sm-circ`,
`fr-circ`, `text`, `card`, `lin-proc`.

## Edges

```mermaid
flowchart LR
  A --> B      %% arrow
  C --- D      %% open link
  E -.-> F     %% dotted
  G ==> H      %% thick
  I --o J      %% circle end
  K --x L      %% cross end
  M <--> N     %% two-way
```

Length is controlled by the number of dashes — `--->` is longer than `-->`, which is how
you push a node further down a rank.

Labels, two ways:

```mermaid
flowchart TD
  A -->|yes| B
  A -- no --> C
  D -- long label ---- E
```

Chains and fan-out:

```mermaid
flowchart LR
  A --> B --> C
  A --> D & E --> F
```

`a --> b & c --> d` means both `b` and `c` sit between `a` and `d`.

## Subgraphs

```mermaid
flowchart TB
  subgraph client [Browser]
    direction LR
    ui[UI] --> store[State]
  end
  subgraph server [API]
    direction LR
    route[Router] --> db[(Postgres)]
  end
  store --> route
```

`direction` inside a subgraph sets its internal flow. Links may target the subgraph id
itself, not just nodes inside it.

## Styling

```mermaid
flowchart LR
  A[Normal] --> B[Highlighted]:::hot
  C --> D
  classDef hot fill:#fee,stroke:#c33,stroke-width:2px
  class C,D hot
  style A fill:#eef,stroke:#66f
  linkStyle 0 stroke:#c33,stroke-width:3px
```

- `classDef name …` defines a class, `:::name` or `class a,b name` applies it
- `style id …` styles one node inline
- `linkStyle N …` styles the Nth edge, counted from 0 in declaration order

On slides, prefer one accent class over per-node `style` — it keeps the diagram readable
and matches the deck's color scheme.

## Icons and images

With an icon pack registered, `fa:fa-truck` inside a label renders an icon:

```mermaid
flowchart LR
  A[fa:fa-database Store] --> B[fa:fa-cloud Sync]
```

## Interaction

```mermaid
flowchart LR
  A --> B
  click A href "https://example.com" "Tooltip"
  click B callback "Tooltip"
```

`click … callback` calls a JS function you registered — rarely worth it in a deck; `href`
is the useful one.

## Two things that break flowcharts

- A lowercase node id `end` breaks parsing. Use `End` or `END`.
- `A---oB` and `A---xB` parse as circle and cross edges, not as nodes named `oB`/`xB`.
  Write `A--- oB` or capitalize the node id.
