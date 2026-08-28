# Mermaid structure diagrams

Class, state, ER, mindmap, packet, and architecture — the diagrams that describe *shape*
rather than sequence.

## Class diagram

```mermaid
classDiagram
  class Animal {
    +String name
    +int age
    +eat() void
    #protectedField
    -privateField
    +virtualMethod()*
    +staticMethod()$
  }
  class Duck {
    +String beakColor
    +swim() void
  }
  Animal <|-- Duck : inherits
  Animal <|-- Fish
```

Visibility prefixes: `+` public, `-` private, `#` protected, `~` package.
Suffixes: `*` abstract, `$` static.

Relations, read left-to-right:

| Syntax | Meaning |
|---|---|
| `A <|-- B` | B inherits A |
| `A *-- B` | composition (B is part of A, dies with it) |
| `A o-- B` | aggregation (B belongs to A, outlives it) |
| `A --> B` | association |
| `A ..> B` | dependency |
| `A ..|> B` | realization / implements |
| `A -- B` | plain link |

Cardinality goes in quotes on either end:

```mermaid
classDiagram
  Customer "1" --> "*" Order : places
```

Generics use `~`: `class Stack~T~ { +push(T) }`.
Styling: `class Animal:::highlight` plus a `classDef highlight fill:#fee`.

## State diagram

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Running : start
  Running --> Idle : stop
  Running --> Crashed : error
  Crashed --> [*]

  state Running {
    direction LR
    [*] --> Working
    Working --> Waiting : io
    Waiting --> Working : ready
  }
```

`[*]` is both the start and end pseudo-state, depending on which side of the arrow it's on.
Composite states nest with `state Name { … }`.

Choice, fork, and join:

```mermaid
stateDiagram-v2
  state check <<choice>>
  state fork1 <<fork>>
  state join1 <<join>>

  [*] --> check
  check --> Positive : n >= 0
  check --> Negative : n < 0

  Positive --> fork1
  fork1 --> TaskA
  fork1 --> TaskB
  TaskA --> join1
  TaskB --> join1
  join1 --> [*]
```

Notes: `note right of State1 : text`, or a multi-line `note left of X` … `end note`.
Concurrency inside a composite state uses `--` as a region separator.

## Entity relationship diagram

```mermaid
erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
  PRODUCT }o--|| LINE_ITEM : "appears in"

  CUSTOMER {
    int id PK
    string email UK
    string name
  }
  ORDER {
    int id PK
    int customer_id FK
    datetime placed_at
  }
```

Cardinality is read as *left-entity to right-entity*, with the marker nearest each entity
describing that side:

| Marker | Meaning |
|---|---|
| `|o` / `o|` | zero or one |
| `||` | exactly one |
| `}o` / `o{` | zero or more |
| `}|` / `|{` | one or more |

`--` is an identifying relationship (solid), `..` non-identifying (dashed).
Attribute keys: `PK`, `FK`, `UK`.

## Mindmap

Indentation alone defines the hierarchy — no arrows.

```mermaid
mindmap
  root((Programming))
    Data
      Types
      Structures
    Control
      Branching
      Loops
    Memory
      Stack
      Heap
```

Node shapes on any level: `id[square]`, `id(rounded)`, `id((circle))`, `id))bang((`,
`id)cloud(`, `id{{hexagon}}`. Icons via `::icon(fa fa-book)` on the line below a node.

Mindmaps auto-size well and are the least fussy diagram for an agenda or overview slide.

## Packet diagram

Byte or bit layouts — headers, protocol frames, struct memory.

```mermaid
packet
  0-15: "Source Port"
  16-31: "Destination Port"
  32-63: "Sequence Number"
  64-95: "Acknowledgment Number"
  96-99: "Data Offset"
  100-105: "Reserved"
  106: "URG"
  107: "ACK"
```

Ranges must be contiguous and ascending; a single number is a one-bit field. The `+N`
form sizes a field relative to the previous one, which is easier to maintain:

```mermaid
packet
title UDP Packet
+16: "Source Port"
+16: "Destination Port"
+16: "Length"
+16: "Checksum"
```

## Architecture diagram

Services, groups, and the links between them.

```mermaid
architecture-beta
  group api(cloud)[API]

  service db(database)[Database] in api
  service disk(disk)[Storage] in api
  service server(server)[Server] in api

  db:L -- R:server
  disk:T -- B:server
```

Edge endpoints carry a side: `L`, `R`, `T`, `B`, so `db:L -- R:server` leaves the left of
`db` and enters the right of `server`. Arrowheads with `<` / `>`: `db:L <-- R:server`.
Icons in parentheses come from registered icon packs (`cloud`, `database`, `disk`,
`server`, `internet` are built in).
