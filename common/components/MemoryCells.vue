<script setup lang="ts">
/**
 * A strip of memory, drawn the way memory actually is: one continuous run of
 * byte-sized cells with consecutive addresses underneath.
 *
 * The point the drawing has to make is GROUPING. A variable is not "a coloured
 * cell" — it is a name attached to a RUN of cells that are read together. So a
 * variable is drawn as a labelled bracket spanning its bytes:
 *
 *          ┌── litera · char ──┐ ┌──────── nota · int ─────────┐
 *      ⋯  │  01100001  │  00000000 │ 00000000 │ 00000000 │ 00001000 │  ⋯
 *            1000          1001       1002       1003       1004
 *
 *   <MemoryCells
 *     :base="1000"
 *     :cells="[{ value: '97' }, { value: '0' }, { value: '0' }, { value: '0' }, { value: '8' }]"
 *     :vars="[
 *       { start: 0, len: 1, name: 'litera', type: 'char' },
 *       { start: 1, len: 4, name: 'nota', type: 'int', highlight: true },
 *     ]"
 *   />
 *
 * The older shorthand still works: a cell with `name` becomes a one-byte
 * variable bracket, so a `char` or a lone box needs no `vars` at all.
 *
 * `value` is free text — `?`, `\\0` and `gunoi` are all fine. Cells share
 * borders, and the strip fades at both ends: what the slide shows is a window,
 * not the whole of memory.
 */
import { computed } from 'vue'

type Cell = { value?: string; addr?: string; name?: string; highlight?: boolean }
type Span = { start: number; len?: number; name: string; type?: string; highlight?: boolean }

const props = withDefaults(
  defineProps<{
    cells: Cell[]
    /** Named runs of cells. A run is what a type turns bytes into. */
    vars?: Span[]
    /** First address; the rest follow by 1. Omit to use each cell's own `addr`. */
    base?: number
    /** How the auto-numbered addresses are written. */
    addrFormat?: 'dec' | 'hex'
    caption?: string
    /** Cell width in px. */
    size?: number
    label?: string
    /** Faded half-cells at both ends. */
    continues?: boolean
    /** The "one byte per box" legend. Turn it off on small repeated strips. */
    axis?: boolean
    color?: string
  }>(),
  {
    vars: () => [],
    addrFormat: 'dec',
    caption: '',
    size: 92,
    label: 'MEMORIE',
    continues: true,
    axis: true,
    color: 'blue-light',
  },
)

/** Explicit spans, plus a one-byte span for every legacy `cell.name`. */
const spans = computed<Required<Span>[]>(() => [
  ...props.vars.map((v) => ({ len: 1, type: '', highlight: false, ...v })),
  ...props.cells
    .map((c, i) => ({ cell: c, i }))
    .filter(({ cell }) => cell.name)
    .map(({ cell, i }) => ({
      start: i,
      len: 1,
      name: cell.name as string,
      type: '',
      highlight: !!cell.highlight,
    })),
])

/** Grid columns are 1-based, and a leading ghost cell shifts everything by one. */
const offset = computed(() => (props.continues ? 1 : 0))

const addrOf = (cell: Cell, i: number) => {
  if (cell.addr !== undefined) return cell.addr
  if (props.base === undefined) return ''
  const n = props.base + i
  return props.addrFormat === 'hex' ? `0x${n.toString(16)}` : String(n)
}

/** A cell inside any span is part of a variable, so it is drawn as occupied. */
const inSpan = (i: number) =>
  spans.value.some((s) => i >= s.start && i < s.start + s.len)

/**
 * `size` is a MINIMUM, not a fixed width: a cell holding `01000001` needs more
 * room than one holding `8`, and a track that clips its own content is worse
 * than a wider strip.
 *
 * The floor is a `min-width` on the cell rather than a `minmax()` track, because
 * a `minmax(Npx, max-content)` track can still resolve to N and let the content
 * spill over its neighbours — which looks like missing cells, not a wide one.
 * `auto` tracks size to the item, min-width included, so the two never disagree.
 */
const gridCols = computed(() => {
  const ghost = `${props.size * 0.5}px`
  const body = `repeat(${props.cells.length}, auto)`
  return props.continues ? `${ghost} ${body} ${ghost}` : body
})
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-mem']" :style="{ '--ns-mem-size': `${size}px` }">
    <div class="ns-mem__board">
      <span v-if="label" class="ns-mem__tag">{{ label }}</span>

      <div class="ns-mem__grid" :style="{ gridTemplateColumns: gridCols }">
        <!-- Row 1: the brackets. This is what a type does to raw bytes. -->
        <div
          v-for="(s, i) in spans"
          :key="`s${i}`"
          :class="['ns-mem__span', { 'ns-mem__span--hi': s.highlight }]"
          :style="{ gridRow: 1, gridColumn: `${offset + s.start + 1} / span ${s.len}` }"
        >
          <span class="ns-mem__span-label">
            <span class="ns-mem__span-name">{{ s.name }}</span>
            <span v-if="s.type" class="ns-mem__span-type">{{ s.type }}</span>
          </span>
          <span class="ns-mem__span-brace" />
        </div>

        <!-- Row 2: the bytes themselves, sharing borders because memory is continuous. -->
        <div v-if="continues" class="ns-mem__cell ns-mem__cell--ghost" :style="{ gridRow: 2, gridColumn: 1 }">⋯</div>
        <div
          v-for="(cell, i) in cells"
          :key="`c${i}`"
          :class="['ns-mem__cell', { 'ns-mem__cell--used': inSpan(i) || cell.highlight }]"
          :style="{ gridRow: 2, gridColumn: offset + i + 1, animationDelay: `${i * 0.07}s` }"
        >
          {{ cell.value ?? '' }}
        </div>
        <div
          v-if="continues"
          class="ns-mem__cell ns-mem__cell--ghost"
          :style="{ gridRow: 2, gridColumn: cells.length + 2 }"
        >⋯</div>

        <!-- Row 3: addresses. Consecutive, so it is visible that they count by one. -->
        <div
          v-for="(cell, i) in cells"
          :key="`a${i}`"
          class="ns-mem__addr"
          :style="{ gridRow: 3, gridColumn: offset + i + 1 }"
        >
          {{ addrOf(cell, i) }}
        </div>
      </div>

      <div v-if="axis" class="ns-mem__axis">
        <span>fiecare pătrat este un byte</span>
        <span class="ns-mem__axis-sep" />
        <span>numărul de dedesubt este adresa lui</span>
      </div>
    </div>

    <div v-if="caption" class="ns-mem__caption">{{ caption }}</div>
  </div>
</template>

<style scoped>
.ns-mem {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ns-mem__board {
  position: relative;
  padding: 1.6rem 1.4rem 0.9rem;
  border: 1.5px solid var(--neversink-admon-border-color);
  border-radius: 16px;
  background: color-mix(in srgb, var(--neversink-admon-bg-color) 30%, #fff);
  box-shadow: 0 14px 30px -24px #000;
}

.ns-mem__tag {
  position: absolute;
  top: -0.7rem;
  left: 1.1rem;
  padding: 0.1em 0.75em;
  border-radius: 999px;
  background: var(--neversink-border-color);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.ns-mem__grid {
  display: grid;
  grid-template-rows: auto auto auto;
  justify-content: center;
}

/* --- the variable bracket ------------------------------------------------ */

.ns-mem__span {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.15rem 0.35rem;
  animation: ns-mem-rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ns-mem__span-label {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  white-space: nowrap;
}

.ns-mem__span-name {
  font-family: monospace;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--neversink-text-color);
}

.ns-mem__span-type {
  padding: 0.05em 0.5em;
  border-radius: 999px;
  background: var(--neversink-admon-bg-color);
  border: 1px solid var(--neversink-admon-border-color);
  font-family: monospace;
  font-size: 0.7rem;
  opacity: 0.85;
}

/* The brace spans the whole run: this is the drawing saying "read these
   together as ONE value". */
.ns-mem__span-brace {
  width: 100%;
  height: 0.5rem;
  margin-top: 0.3rem;
  border: 2px solid var(--neversink-admon-border-color);
  border-bottom: none;
  border-radius: 7px 7px 0 0;
}

.ns-mem__span--hi .ns-mem__span-brace {
  border-color: var(--neversink-border-color);
}

.ns-mem__span--hi .ns-mem__span-name {
  color: var(--neversink-fg-color);
}

/* --- the bytes ----------------------------------------------------------- */

.ns-mem__cell {
  min-width: var(--ns-mem-size);
  padding: 0.75rem 0.65rem;
  white-space: nowrap;
  border: 1.5px solid var(--neversink-admon-border-color);
  /* Cells touch, so the strip reads as one run rather than loose boxes. */
  margin-left: -0.75px;
  background: #fff;
  font-family: monospace;
  font-size: 1.05rem;
  text-align: center;
  animation: ns-mem-rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ns-mem__cell--used {
  background: var(--neversink-admon-bg-color);
  border-color: var(--neversink-border-color);
  color: var(--neversink-fg-color);
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.ns-mem__cell--ghost {
  min-width: calc(var(--ns-mem-size) * 0.5);
  border-style: dashed;
  background: transparent;
  opacity: 0.4;
  animation: none;
}

/* --- addresses ----------------------------------------------------------- */

.ns-mem__addr {
  margin-top: 0.4rem;
  min-width: 0;
  font-family: monospace;
  font-size: 0.72rem;
  text-align: center;
  opacity: 0.6;
  color: var(--neversink-text-color);
}

.ns-mem__axis {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 0.9rem;
  font-size: 0.66rem;
  letter-spacing: 0.04em;
  opacity: 0.55;
  color: var(--neversink-text-color);
}

.ns-mem__axis-sep {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
}

.ns-mem__caption {
  margin-top: 0.7rem;
  font-size: 0.85rem;
  opacity: 0.75;
}

@keyframes ns-mem-rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
