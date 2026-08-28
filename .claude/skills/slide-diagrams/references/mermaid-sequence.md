# Mermaid sequence diagrams

Shows messages between participants over time. Good for protocols, request flows, and
anything where *order* is the point.

## Basics

```mermaid
sequenceDiagram
  participant B as Browser
  participant S as Server
  participant D as Database

  B->>S: GET /users
  S->>D: SELECT * FROM users
  D-->>S: rows
  S-->>B: 200 OK (JSON)
```

`participant X as Label` sets the display name; declaration order fixes the column order.
Use `actor X` instead of `participant X` to draw a stick figure.

## Arrow types

| Syntax | Meaning |
|---|---|
| `->` | solid line, no arrowhead |
| `-->` | dotted line, no arrowhead |
| `->>` | solid line with arrowhead — a call |
| `-->>` | dotted line with arrowhead — a return |
| `-x` | solid, cross end — async, no reply expected |
| `--x` | dotted, cross end |
| `-)` | solid, open arrow — async |
| `--)` | dotted, open arrow |

The convention worth keeping: solid `->>` going out, dotted `-->>` coming back.

## Activation

```mermaid
sequenceDiagram
  Client->>+API: request
  API->>+Worker: enqueue
  Worker-->>-API: done
  API-->>-Client: response
```

`+` and `-` suffixed on the arrow open and close an activation bar. `activate X` /
`deactivate X` do the same explicitly.

## Grouping

```mermaid
sequenceDiagram
  Client->>Server: login

  alt valid credentials
    Server-->>Client: token
  else invalid
    Server-->>Client: 401
  end

  opt remember me
    Server-->>Client: set cookie
  end

  loop every 5 min
    Client->>Server: refresh
  end

  par notify email
    Server->>Mailer: send
  and notify push
    Server->>Push: send
  end

  critical acquire lock
    Server->>DB: lock
  option timeout
    Server-->>Client: 503
  end
```

`alt`/`else`, `opt`, `loop`, `par`/`and`, `critical`/`option`, `break` — all closed by `end`.

## Notes and separators

```mermaid
sequenceDiagram
  participant A
  participant B
  Note left of A: only A sees this
  Note right of B: and this
  Note over A,B: spanning note
  A->>B: hi
  rect rgb(240, 248, 255)
    B->>A: inside a shaded region
  end
```

## Autonumber and background

```mermaid
sequenceDiagram
  autonumber
  Alice->>Bob: first (1)
  Bob->>Alice: second (2)
```

`autonumber` labels every message in order — useful when you want to talk through steps by
number during a presentation.

## Slide sizing

Sequence diagrams grow *wide* with participants and *tall* with messages. Four participants
and a dozen messages is about the limit for one 16:9 slide at `scale: 0.8`. Past that, cut
the diagram at a natural boundary and continue on the next slide with the same participant
declarations.
