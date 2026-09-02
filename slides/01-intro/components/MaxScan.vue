<script setup lang="ts">
/**
 * The "find the largest number" recipe, running by itself.
 *
 * A cursor walks the list once, left to right, and a single remembered value
 * follows along. That is the whole point: the computer never SEES the list the
 * way we do — at any moment it holds exactly one number in mind and compares it
 * to the one under the cursor.
 *
 * While the lesson is being taught it follows the slide's clicks: one number per
 * click, so the walk happens at the speed you talk. In an archived deck the
 * reveals are stripped (CLAUDE.md §4), nothing can advance it and `clicksTotal`
 * is 0 — so it plays itself on a loop instead. Same animation, driven from
 * whichever source exists.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNav } from '@slidev/client'

const props = withDefaults(
  defineProps<{
    /** The list to scan. */
    values?: number[]
    /** Click at which the first number lights up. */
    firstClick?: number
    /** Autoplay only: time on each number, ms. */
    stepMs?: number
    /** Autoplay only: pause on the answer before starting over, ms. */
    holdMs?: number
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  { values: () => [4, 9, 2, 12, 7], firstClick: 1, stepMs: 1100, holdMs: 2400, color: 'blue-light' },
)

const { clicks, clicksTotal } = useNav()

/** No clicks on this slide at all: the reveals were stripped, so play alone. */
const selfDriven = computed(() => clicksTotal.value === 0)

/* ── autoplay, used only when nothing can advance us ────────────────────── */

const autoIdx = ref(-1)
let timer: ReturnType<typeof setTimeout> | undefined

function schedule() {
  const last = props.values.length
  const wait = autoIdx.value === last ? props.holdMs : autoIdx.value < 0 ? 700 : props.stepMs
  timer = setTimeout(() => {
    autoIdx.value = autoIdx.value >= last ? -1 : autoIdx.value + 1
    schedule()
  }, wait)
}

// clicksTotal is not known at mount — it settles once the slide's v-clicks have
// registered — so start or stop the loop when the answer actually arrives.
watch(selfDriven, (alone) => {
  clearTimeout(timer)
  if (alone) {
    autoIdx.value = -1
    schedule()
  }
}, { immediate: true })

onBeforeUnmount(() => clearTimeout(timer))

/** -1 = before the start, 0..n-1 = on that number, n = finished. */
const idx = computed(() => {
  if (selfDriven.value)
    return autoIdx.value
  const step = clicks.value - props.firstClick
  return Math.min(props.values.length, Math.max(-1, step))
})

const done = computed(() => idx.value >= props.values.length)

/** The largest value seen so far — what the computer is holding. */
const remembered = computed<number | null>(() => {
  if (idx.value < 0)
    return null
  const seen = props.values.slice(0, Math.min(idx.value + 1, props.values.length))
  return seen.length ? Math.max(...seen) : null
})

const maxIndex = computed(() => props.values.indexOf(Math.max(...props.values)))

/** Was the current number bigger than everything before it? */
const replaced = computed(() => {
  if (idx.value <= 0 || done.value)
    return false
  const before = Math.max(...props.values.slice(0, idx.value))
  return props.values[idx.value] > before
})

/** The sentence under the strip — the step said out loud. */
const caption = computed(() => {
  if (idx.value < 0)
    return 'Nu știm încă nimic despre listă.'
  if (done.value)
    return `Lista s-a terminat. Cel mai mare număr este ${remembered.value}.`
  const value = props.values[idx.value]
  if (idx.value === 0)
    return `Primul număr: ține minte ${value}.`
  const before = Math.max(...props.values.slice(0, idx.value))
  return replaced.value
    ? `${value} este mai mare decât ${before} — ține minte ${value}.`
    : `${value} nu este mai mare decât ${before} — mergi mai departe.`
})

function tileClass(i: number) {
  if (done.value)
    return i === maxIndex.value ? 'is-answer' : 'is-past'
  if (i === idx.value)
    return replaced.value || idx.value === 0 ? 'is-current is-takes' : 'is-current'
  return i < idx.value ? 'is-past' : 'is-ahead'
}
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-scan']">
    <div class="ns-scan__row">
      <div class="ns-scan__list">
        <div v-for="(value, i) in values" :key="i" class="ns-scan__tile" :class="tileClass(i)">
          {{ value }}
        </div>
      </div>

      <div class="ns-scan__memo" :class="{ 'is-on': remembered !== null, 'is-answer': done }">
        <span class="ns-scan__memo-label">ține minte</span>
        <span :key="remembered ?? 'none'" class="ns-scan__memo-value">
          {{ remembered ?? '—' }}
        </span>
      </div>
    </div>

    <p class="ns-scan__caption" :class="{ 'is-answer': done }">{{ caption }}</p>
  </div>
</template>

<style scoped>
.ns-scan {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  font-variant-numeric: tabular-nums;
}

.ns-scan__row {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.ns-scan__list {
  display: flex;
  gap: 0.6rem;
}

.ns-scan__tile {
  display: grid;
  place-items: center;
  width: 3.4rem;
  height: 3.4rem;
  border: 2px solid var(--neversink-admon-border-color);
  border-radius: 0.6rem;
  background: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--neversink-fg-color);
  transition: all 0.3s cubic-bezier(0.34, 1.25, 0.64, 1);
}

/* Not reached yet: present, but not yet part of the story. */
.ns-scan__tile.is-ahead {
  opacity: 0.45;
}

/* Already compared and rejected — visible, so the walk stays traceable. */
.ns-scan__tile.is-past {
  opacity: 0.35;
  transform: scale(0.92);
}

/* Under the cursor. */
.ns-scan__tile.is-current {
  border-color: var(--neversink-border-color);
  transform: translateY(-6px) scale(1.1);
  box-shadow: 0 10px 20px -10px var(--neversink-fg-color);
}

/* Under the cursor AND bigger than everything before it. */
.ns-scan__tile.is-takes {
  background: var(--neversink-admon-bg-color);
}

.ns-scan__tile.is-answer {
  opacity: 1;
  border-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
  transform: scale(1.12);
  box-shadow: 0 12px 24px -12px var(--neversink-fg-color);
}

.ns-scan__memo {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 5.4rem;
  padding: 0.4rem 0.9rem;
  border: 2px dashed var(--neversink-admon-border-color);
  border-radius: 0.6rem;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.ns-scan__memo.is-on {
  opacity: 1;
  border-style: solid;
  border-color: var(--neversink-border-color);
}

.ns-scan__memo.is-answer {
  background: var(--neversink-admon-bg-color);
}

.ns-scan__memo-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--neversink-text-color);
  opacity: 0.75;
}

/* Keyed on the value, so replacing the remembered number remounts the span
   and replays the pop — the update is seen, not just read. */
.ns-scan__memo-value {
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--neversink-fg-color);
  animation: ns-scan-pop 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
}

@keyframes ns-scan-pop {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.ns-scan__caption {
  margin: 0;
  min-height: 1.6em;
  font-size: 1rem;
  color: var(--neversink-fg-color);
  opacity: 0.85;
}

.ns-scan__caption.is-answer {
  font-weight: 700;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .ns-scan__tile,
  .ns-scan__memo { transition-duration: 0.01ms !important; }
  .ns-scan__memo-value { animation: none !important; }
}
</style>
