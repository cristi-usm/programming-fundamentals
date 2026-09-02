<script setup lang="ts">
/**
 * The averaging of three notes, performed rather than listed.
 *
 * Three note tiles, an accumulator and a result box. Each step lights the
 * cells it touches and the numbers count up to their new value, so the class
 * watches the sum being BUILT (17, then 27) instead of reading "27" on a slide.
 *
 * It follows the slide's clicks: step N runs at click `firstClick + N - 1`.
 * With clicks stripped — every deck that is not the lesson being taught, see
 * CLAUDE.md §4 — `clicksTotal` is 0 and there is nothing to advance it, so the
 * component plays itself on a loop instead. A student reading the archived
 * lesson still sees the process, they just do not drive it.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'

const props = withDefaults(
  defineProps<{
    /** The three notes. */
    values?: number[]
    /** Click at which step 1 fires. */
    firstClick?: number
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  { values: () => [8, 9, 10], firstClick: 2, color: 'blue-light' },
)

const STEPS = 5

const { clicks, clicksTotal } = useNav()

/* ── the step, from clicks or from the autoplay loop ───────────────────── */

const selfDriven = computed(() => clicksTotal.value === 0)
const autoStep = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (!selfDriven.value)
    return
  // One beat per step, then a longer hold on the answer before looping.
  timer = setInterval(() => {
    autoStep.value = autoStep.value >= STEPS + 2 ? 0 : autoStep.value + 1
  }, 1100)
})
onBeforeUnmount(() => clearInterval(timer))

const step = computed(() => {
  if (selfDriven.value)
    return Math.min(STEPS, autoStep.value)
  return Math.min(STEPS, Math.max(0, clicks.value - props.firstClick + 1))
})

/* ── what each step is doing ───────────────────────────────────────────── */

const total = computed(() => props.values.reduce((a, b) => a + b, 0))
const partial = computed(() => props.values[0] + props.values[1])

/** Which note tiles are lit right now. */
function tileState(i: number): 'empty' | 'idle' | 'active' | 'spent' {
  if (step.value < 1)
    return 'empty'
  if (step.value === 2)
    return i < 2 ? 'active' : 'idle'
  if (step.value === 3)
    return i === 2 ? 'active' : 'spent'
  if (step.value > 3)
    return 'spent'
  return 'idle'
}

const sum = computed<number | null>(() => {
  if (step.value < 2)
    return null
  return step.value === 2 ? partial.value : total.value
})

const result = computed<number | null>(() => (step.value < 4 ? null : total.value / props.values.length))

/* ── numbers that count instead of cutting ─────────────────────────────── */

function useCounted(target: () => number | null) {
  const shown = ref(0)
  let frame = 0
  watch(
    computed(target),
    (to, from) => {
      cancelAnimationFrame(frame)
      if (to == null) {
        shown.value = 0
        return
      }
      const start = performance.now()
      const base = from ?? 0
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 420)
        const eased = 1 - (1 - t) ** 3
        shown.value = base + (to - base) * eased
        if (t < 1)
          frame = requestAnimationFrame(tick)
        else shown.value = to
      }
      frame = requestAnimationFrame(tick)
    },
    { immediate: true },
  )
  onBeforeUnmount(() => cancelAnimationFrame(frame))
  return shown
}

const shownSum = useCounted(() => sum.value)
const shownResult = useCounted(() => result.value)

/** Trailing zeros would make 9 look like a measurement. */
const fmt = (n: number) => (Math.round(n * 100) / 100).toString()
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-avg']">
    <!-- the three notes -->
    <div class="ns-avg__notes">
      <template v-for="(value, i) in values" :key="i">
        <span v-if="i > 0" class="ns-avg__op" :class="{ 'is-on': step >= 2 + Math.min(i - 1, 1) }">+</span>
        <div class="ns-avg__tile" :class="`is-${tileState(i)}`">
          <span v-if="step >= 1">{{ value }}</span>
          <span v-else class="ns-avg__unknown">?</span>
        </div>
      </template>
    </div>

    <div class="ns-avg__arrow" :class="{ 'is-on': step >= 2 }" />

    <!-- the accumulator -->
    <div class="ns-avg__box" :class="{ 'is-on': step >= 2, 'is-spent': step >= 4 }">
      <span class="ns-avg__label">sumă</span>
      <span class="ns-avg__value">{{ sum === null ? '—' : fmt(shownSum) }}</span>
    </div>

    <div class="ns-avg__divide" :class="{ 'is-on': step >= 4 }">÷ {{ values.length }}</div>

    <!-- the answer -->
    <div class="ns-avg__box ns-avg__box--result" :class="{ 'is-on': step >= 4, 'is-shown': step >= 5 }">
      <span class="ns-avg__label">media</span>
      <span class="ns-avg__value">{{ result === null ? '—' : fmt(shownResult) }}</span>
    </div>
  </div>
</template>

<style scoped>
.ns-avg {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.9rem 0.6rem 0.7rem;
  border-top: 1px solid var(--neversink-admon-border-color);
  font-variant-numeric: tabular-nums;
}

.ns-avg__notes {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

/* A note tile. Four states, and the transition between them is the point:
   `active` is the cell the current step is reading, `spent` one already
   folded into the sum — dimmed, not removed, so the class can still see
   where the number came from. */
.ns-avg__tile {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid var(--neversink-admon-border-color);
  border-radius: 0.5rem;
  background: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--neversink-fg-color);
  transition: all 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
}

.ns-avg__tile.is-empty {
  color: var(--neversink-admon-border-color);
  border-style: dashed;
}

.ns-avg__unknown {
  font-weight: 400;
  opacity: 0.6;
}

.ns-avg__tile.is-active {
  border-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 8px 18px -10px var(--neversink-fg-color);
}

.ns-avg__tile.is-spent {
  opacity: 0.4;
  transform: scale(0.94);
}

.ns-avg__op {
  font-size: 1rem;
  font-weight: 700;
  color: var(--neversink-admon-border-color);
  transition: color 0.3s ease;
}

.ns-avg__op.is-on {
  color: var(--neversink-border-color);
}

/* The flow arrow: a rule that draws itself left-to-right when the sum starts. */
.ns-avg__arrow {
  position: relative;
  width: 1.6rem;
  height: 2px;
  background: var(--neversink-admon-border-color);
  transform: scaleX(0.2);
  transform-origin: left;
  opacity: 0.5;
  transition: transform 0.4s ease, opacity 0.4s ease, background 0.4s ease;
}

.ns-avg__arrow.is-on {
  transform: scaleX(1);
  opacity: 1;
  background: var(--neversink-border-color);
}

.ns-avg__box {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 4.6rem;
  padding: 0.3rem 0.7rem;
  border: 2px solid var(--neversink-admon-border-color);
  border-radius: 0.5rem;
  background: #fff;
  opacity: 0.45;
  transition: all 0.35s ease;
}

.ns-avg__box.is-on {
  opacity: 1;
  border-color: var(--neversink-border-color);
}

/* Once divided, the sum steps back so the answer is the only lit box. */
.ns-avg__box.is-spent {
  opacity: 0.45;
  border-color: var(--neversink-admon-border-color);
}

.ns-avg__box--result.is-shown {
  background: var(--neversink-admon-bg-color);
  transform: scale(1.06);
  box-shadow: 0 10px 22px -12px var(--neversink-fg-color);
}

.ns-avg__label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--neversink-text-color);
  opacity: 0.75;
}

.ns-avg__value {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--neversink-fg-color);
}

.ns-avg__divide {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--neversink-admon-border-color);
  transition: color 0.3s ease, transform 0.3s ease;
}

.ns-avg__divide.is-on {
  color: var(--neversink-border-color);
  transform: scale(1.12);
}

@media (prefers-reduced-motion: reduce) {
  .ns-avg *,
  .ns-avg *::before {
    transition-duration: 0.01ms !important;
  }
}
</style>
