# Neversink components — full props

Every `color` prop accepts any Neversink color scheme name.

## Admonition

Colored callout box with icon and title.

- `title` — default `'Note'`
- `color` — default `amber-light`
- `width` — default `100%`
- `icon` — default `mdi-information-variant-circle-outline`
- `custom` — extra classes on the content
- `customTitle` — extra classes on the title

```vueq
<Admonition title="Info" color="teal-light" width="300px">
This is my admonition content.
</Admonition>
```

## AdmonitionType

Same box, but type-driven colors and icons.

- `type` — `info` (default) | `important` | `tip` | `warning` | `caution`
- `width` — default `100%`

## StickyNote

- `title` — default `''`
- `color` — default `amber-light`
- `width` — default `180px`
- `textAlign` — default `left`
- `custom`, `customTitle` (default `block text-xs font-mono tracking-normal font-bold`)
- `devOnly` — visible in dev only, stripped from builds and exports. Good for
  presenter reminders.

## SpeechBubble

- `position` — `t` | `b` (default) | `l` | `r` | `tl` | `tr` | `bl` | `br`
- `shape` — `''` | `round` | `circle`
- `animation` — `''` | `pop` | `float`
- `color` — default `red-light`
- `textAlign` — default `left`
- `maxWidth` — default `100%`
- `borderWidth` — default `1px`

## Box

- `shape` — four kebab parts: shape (`s` square | `r` rounded | `f` full/circle), border
  (`s` solid | `d` dashed | `o` dotted), radius in px, fill opacity (0 opaque → 100
  transparent). Default `s-s-2-100`.
- `size` — default `150px`
- `color` — default `white` (black border, white fill)
- `custom` — extra classes; needed to affect the border, since opacity only hits the fill
- default slot renders text inside the box

## QRCode

- `value` (required) — the URL
- `:size` (required)
- `render-as` — `svg` (default) | `canvas` | `img`

## Email

- `v` (required) — the address; renders a `mailto:` link with an icon

## Thumb

- `dir` — `up` (default) | `down`
- `color` — default `white`; light schemes read best
- `width` — default `140px`

## Line / VDragLine

- `x1`, `y1`, `x2`, `y2` (required, bind with `:`)
- `width` — default `2`
- `color` — default `black`; the scheme's background color becomes the stroke

`VDragLine` is the same, positioned by dragging.

## ArrowDraw / ArrowHeads

Hand-drawn arrow, and a set of arrows converging on a point.

- `color` — default `black`
- `width` — default `140px`

## CreditScroll

- `speed` — default `0.5`, higher is faster
- `loop` — default `false`

Scrolling starts on slide entry and resets when you re-enter. `layout: credits` wraps this
and is usually easier.

## Kawaii

Characters: `IceCream`, `Backpack`, `Cat`, `Browser`, `Mug`, `Planet`, `SpeechBubbleGuy`,
`CreditCard`.

- `mood` — `sad` | `shocked` | `happy` | `blissful` (default) | `lovestruck` | `excited` | `ko`
- `:size` — width; height follows
- `:color` — hex code; each character has its own default

```vue
<IceCream :size="140" mood="sad" color="#FDA7DC" />
```
