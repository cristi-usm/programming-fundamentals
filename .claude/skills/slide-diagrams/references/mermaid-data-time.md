# Mermaid data and time diagrams

Charts, schedules, and anything laid out along an axis.

## Pie

```mermaid
pie showData
  title Language use
  "C" : 45
  "Python" : 30
  "Other" : 25
```

`showData` prints the raw values next to the percentages. Values are summed and converted
to percentages automatically — they need not add to 100.

## XY chart

Bars and lines on real axes.

```mermaid
xychart
  title "Build time by week"
  x-axis [w1, w2, w3, w4, w5]
  y-axis "Seconds" 0 --> 120
  bar [95, 88, 74, 61, 52]
  line [95, 88, 74, 61, 52]
```

`xychart horizontal` rotates it. Multiple `bar` / `line` rows overlay series. The
x-axis can be a numeric range instead of categories: `x-axis "Time" 0 --> 100`.

## Quadrant chart

Positioning on two axes — effort/impact, reach/cost.

```mermaid
quadrantChart
  title Effort vs impact
  x-axis "Low effort" --> "High effort"
  y-axis "Low impact" --> "High impact"
  quadrant-1 Do now
  quadrant-2 Plan
  quadrant-3 Drop
  quadrant-4 Quick wins
  "Rewrite parser": [0.8, 0.7]
  "Fix typo": [0.1, 0.15]
  "Add cache": [0.35, 0.8]
```

Coordinates are `[x, y]` in 0–1. Quadrants number counter-clockwise from top-right.

## Gantt

```mermaid
gantt
  title Course plan
  dateFormat YYYY-MM-DD
  axisFormat %d %b
  excludes weekends

  section Basics
    Syntax          :done,    a1, 2026-02-01, 10d
    Types           :active,  a2, after a1, 7d
  section Advanced
    Pointers        :         a3, after a2, 14d
    Project         :crit,    a4, after a3, 21d
    Review          :milestone, m1, after a4, 0d
```

- `dateFormat` parses your input dates; `axisFormat` is the d3 format for the printed axis
- Task tags: `done`, `active`, `crit`, `milestone`
- Duration units: `d`, `w`, `h`, `m`; `after <id>` chains tasks
- `excludes weekends` / specific dates removes them from the timeline

Gantt charts get wide fast. On a slide, keep it to two sections and under ~8 tasks.

## Timeline

Events in order, with no notion of duration — much cleaner than a gantt when you only need
"this, then that".

```mermaid
timeline
  title History of C
  1972 : C created at Bell Labs
  1978 : K&R first edition
  1989 : ANSI C (C89)
  1999 : C99
       : inline, //-comments
  2011 : C11
  2024 : C23
```

Multiple `:` entries under one period stack as separate events. `section Name` groups
consecutive periods under a colored band.

## Git graph

```mermaid
gitGraph
  commit id: "init"
  branch develop
  checkout develop
  commit
  commit id: "feature done"
  checkout main
  merge develop tag: "v1.0"
  commit type: HIGHLIGHT
```

Commit options: `id:`, `tag:`, `type:` (`NORMAL`, `REVERSE`, `HIGHLIGHT`).
Also `cherry-pick id: "..."`. Orientation via config:

````md
```mermaid
---
config:
  gitGraph:
    mainBranchName: main
    rotateCommitLabel: false
---
gitGraph
  commit
```
````

## Sankey

Flow volumes between stages. Input is plain CSV: source, target, value.

```mermaid
sankey
Applied,Screened,1000
Screened,Interviewed,300
Screened,Rejected,700
Interviewed,Offered,60
Interviewed,Rejected,240
```

No title line, no quotes unless a label contains a comma.

## User journey

```mermaid
journey
  title Submitting an assignment
  section Prepare
    Read the brief: 4: Student
    Write the code: 3: Student
  section Submit
    Upload: 2: Student
    Wait for grade: 1: Student, Teacher
```

Each step is `Label: score: actors`, where score runs 1 (miserable) to 5 (delighted).
Multiple actors are comma-separated.

## Block diagram

Free-form boxes in a grid — handy for architecture sketches without the strictness of
`architecture-beta`.

```mermaid
block
  columns 3
  Frontend:3
  API Cache DB
  space:3
  Worker:2 Queue
```

`columns N` sets the grid width; `name:N` makes a block span N columns; `space` leaves a
gap. Arrows connect declared block ids: `API --> DB`.

## Sizing on slides

Chart types with an axis (`gantt`, `xychart`, `timeline`, `sankey`) render much wider than
tall and will overflow a 16:9 slide before they look crowded. Set `{scale: 0.7}` and check
the rendered slide rather than trusting the source's apparent size.
