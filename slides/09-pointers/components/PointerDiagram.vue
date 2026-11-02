<script setup lang="ts">
/**
 * Variables as boxes, with an arrow from each pointer to what it points at.
 *
 *             ╭──────────────────────╮
 *             │                      ▼
 *        ┌─────────┐            ┌─────────┐
 *        │  1000   │            │    5    │
 *        └─────────┘            └─────────┘
 *       p · int *  1008        x · int  1000
 *
 *   <PointerDiagram
 *     :boxes="[
 *       { name: 'p', type: 'int *', value: '1000', addr: '1008' },
 *       { name: 'x', type: 'int', value: '5', addr: '1000', highlight: true },
 *     ]"
 *     :arrows="[{ from: 0, to: 1 }]"
 *   />
 *
 * <MemoryCells> draws bytes and cannot draw an arrow; this draws whole variables,
 * which is the level a pointer is explained at. The arrow is what the value of a
 * pointer MEANS, so the value (an address) is always printed too: the arrow is a
 * reading aid, not a replacement for the number.
 *
 * Every box has the same width and the gap is fixed, so arrow ends are computed
 * from the index alone (no DOM measuring, which Slidev's scaling would distort).
 *
 * `groups` draws a bracket under a run of boxes, labelled with the function the
 * variables belong to (`main`, `schimba`). `dead` draws a box whose memory no
 * longer belongs to the program (a frame that is gone); `ghost` is a `⋯` spacer.
 */
import { computed } from 'vue'

type Box = {
  name?: string
  type?: string
  value?: string
  addr?: string
  note?: string
  highlight?: boolean
  dead?: boolean
  ghost?: boolean
}
/** `below` routes the arrow under the boxes, for two arrows that would cross. */
type Arrow = { from: number; to: number; below?: boolean }
type Group = { start: number; len?: number; label: string; dead?: boolean }

const props = withDefaults(
  defineProps<{
    boxes: Box[]
    arrows?: Arrow[]
    groups?: Group[]
    /** Box width in px. */
    width?: number
    /** Space between boxes in px. */
    gap?: number
  }>(),
  { arrows: () => [], groups: () => [], width: 130, gap: 44 },
)

const total = computed(() => props.boxes.length * props.width + (props.boxes.length - 1) * props.gap)
const centre = (i: number) => i * (props.width + props.gap) + props.width / 2

/** Longer arrows arc higher, so two arrows over the same boxes do not overlap. */
const arcHeight = (a: Arrow) => 22 + 14 * Math.abs(a.to - a.from)
const above = computed(() => props.arrows.filter((a) => !a.below))
const below = computed(() => props.arrows.filter((a) => a.below))
const heightOf = (list: Arrow[]) => (list.length ? Math.max(...list.map(arcHeight)) + 12 : 0)
const aboveHeight = computed(() => heightOf(above.value))
const belowHeight = computed(() => heightOf(below.value))

// Leave the source slightly off-centre, so an arrow arriving at the same box
// from the other side does not land on top of it.
const ends = (a: Arrow) => [centre(a.from) + (a.to > a.from ? 12 : -12), centre(a.to)]

const abovePaths = computed(() =>
  above.value.map((a) => {
    const y = aboveHeight.value
    const [x1, x2] = ends(a)
    const top = y - arcHeight(a)
    return `M ${x1} ${y} C ${x1} ${top}, ${x2} ${top}, ${x2} ${y - 3}`
  }),
)

const belowPaths = computed(() =>
  below.value.map((a) => {
    const [x1, x2] = ends(a)
    const bottom = arcHeight(a)
    return `M ${x1} 0 C ${x1} ${bottom}, ${x2} ${bottom}, ${x2} 3`
  }),
)

const markerId = `fp-ptr-head-${Math.random().toString(36).slice(2, 8)}`

/** Row 1 holds the arrows above the boxes, row 3 the ones below. */
const sides = computed(() =>
  [
    { row: 1, height: aboveHeight.value, paths: abovePaths.value },
    { row: 3, height: belowHeight.value, paths: belowPaths.value },
  ].filter((side) => side.paths.length),
)
</script>

<template>
  <div class="fp-ptr neversink-blue-light-scheme">
    <div
      class="fp-ptr__grid"
      :style="{ gridTemplateColumns: `repeat(${boxes.length}, ${width}px)`, columnGap: `${gap}px` }"
    >
      <svg
        v-for="side in sides"
        :key="side.row"
        class="fp-ptr__arrows"
        :width="total"
        :height="side.height"
        :viewBox="`0 0 ${total} ${side.height}`"
        :style="{ gridColumn: `1 / span ${boxes.length}`, gridRow: side.row }"
      >
        <defs>
          <marker :id="`${markerId}-${side.row}`" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" style="fill: var(--neversink-border-color)" />
          </marker>
        </defs>
        <path
          v-for="(d, i) in side.paths"
          :key="i"
          :d="d"
          fill="none"
          :marker-end="`url(#${markerId}-${side.row})`"
          style="stroke: var(--neversink-border-color); stroke-width: 2.5"
        />
      </svg>

      <template v-for="(b, i) in boxes" :key="i">
        <div class="fp-ptr__box" :style="{ gridColumn: i + 1, gridRow: 2 }">
          <div
            :class="[
              'fp-ptr__cell',
              { 'is-hi': b.highlight, 'is-dead': b.dead, 'is-ghost': b.ghost },
            ]"
          >
            {{ b.ghost ? '⋯' : b.value ?? '' }}
          </div>
          <div v-if="!b.ghost" :class="['fp-ptr__label', { 'is-dead': b.dead }]">
            <span class="fp-ptr__name">{{ b.name }}</span>
            <span v-if="b.type" class="fp-ptr__type">{{ b.type }}</span>
          </div>
          <div v-if="b.addr" class="fp-ptr__addr">adresa {{ b.addr }}</div>
          <div v-if="b.note" class="fp-ptr__note">{{ b.note }}</div>
        </div>
      </template>

      <div
        v-for="(g, i) in groups"
        :key="`g${i}`"
        :class="['fp-ptr__group', { 'is-dead': g.dead }]"
        :style="{ gridColumn: `${g.start + 1} / span ${g.len ?? 1}`, gridRow: 4 }"
      >
        <span class="fp-ptr__brace" />
        <span class="fp-ptr__group-label">{{ g.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fp-ptr {
  display: flex;
  justify-content: center;
}

.fp-ptr__grid {
  display: grid;
  grid-template-rows: auto auto auto auto;
  justify-content: center;
}

.fp-ptr__arrows {
  overflow: visible;
  margin: 2px 0;
}

.fp-ptr__box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fp-ptr__cell {
  width: 100%;
  padding: 0.7rem 0.4rem;
  border: 2px solid var(--neversink-admon-border-color);
  border-radius: 10px;
  background: color-mix(in srgb, var(--neversink-admon-bg-color) 30%, #fff);
  font-family: monospace;
  font-size: 1.15rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  color: var(--neversink-text-color);
}

.fp-ptr__cell.is-hi {
  background: var(--neversink-admon-bg-color);
  border-color: var(--neversink-border-color);
  color: var(--neversink-fg-color);
}

/* Memory that no longer belongs to the program: still drawn, but crossed out. */
.fp-ptr__cell.is-dead {
  border-style: dashed;
  background: transparent;
  opacity: 0.45;
}

.fp-ptr__cell.is-ghost {
  border-style: dashed;
  background: transparent;
  opacity: 0.4;
  font-weight: 400;
}

.fp-ptr__label {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  margin-top: 0.4rem;
  white-space: nowrap;
}

.fp-ptr__label.is-dead { opacity: 0.45; }

.fp-ptr__name {
  font-family: monospace;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--neversink-text-color);
}

.fp-ptr__type {
  padding: 0.05em 0.5em;
  border-radius: 999px;
  background: var(--neversink-admon-bg-color);
  border: 1px solid var(--neversink-admon-border-color);
  font-family: monospace;
  font-size: 0.7rem;
}

.fp-ptr__addr {
  margin-top: 0.15rem;
  font-family: monospace;
  font-size: 0.72rem;
  opacity: 0.6;
}

.fp-ptr__note {
  margin-top: 0.15rem;
  font-size: 0.7rem;
  opacity: 0.7;
  text-align: center;
}

.fp-ptr__group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
}

.fp-ptr__group.is-dead { opacity: 0.45; }

.fp-ptr__brace {
  width: 100%;
  height: 0.5rem;
  border: 2px solid var(--neversink-admon-border-color);
  border-top: none;
  border-radius: 0 0 7px 7px;
}

.fp-ptr__group-label {
  margin-top: 0.25rem;
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--neversink-text-color);
}
</style>
