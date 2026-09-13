<script setup lang="ts">
/**
 * What each `scanf` call does to the buffer.
 *
 * Everything surprising about `scanf` comes from one fact: the program does not
 * read "what you typed", it reads characters out of a buffer, left to right,
 * and each conversion takes only what it recognises. What it does not take
 * stays there for the next call.
 *
 * The drawing is built from three parts, and each one answers a question the
 * students ask out loud:
 *
 *   1. INSTRUCȚIUNI — every call is on screen from the start, dimmed. Only the
 *      one that is running lights up. So "which line are we on" is never a
 *      guess, and the students can see what is coming.
 *   2. BUFFER — drawn like a strip of memory (same vocabulary as
 *      <MemoryCells>): cells touch, positions underneath. Because that is what
 *      it is, not a row of loose boxes.
 *   3. The variable — where the characters that were taken ended up, or a
 *      struck-through box when the call produced nothing.
 *
 * Characters are never removed, only dimmed, so the whole walk stays readable
 * at the last step.
 *
 * Advancing is the slide's clicks: one call per click. In an archived deck the
 * reveals are stripped (CLAUDE.md §4), nothing can advance it and `clicksTotal`
 * is 0, so it plays itself on a loop instead.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNav } from '@slidev/client'

interface Step {
  /** The call, shown in the instruction list. */
  by: string
  /** How many leading whitespace characters this call skips. */
  skip?: number
  /** How many characters it then takes. */
  take?: number
  /** True if the call failed: it took nothing and left everything in place. */
  fail?: boolean
  /** What landed in the variable, e.g. "nota = 9". */
  into?: string
  /** The sentence said out loud for this step. */
  note: string
  /** What the call returned. */
  ret?: string
}

const props = withDefaults(
  defineProps<{
    /** What the user typed, Enter included. */
    typed?: string
    /** The calls made over that buffer, in order. */
    steps?: Step[]
    /** Caption shown before the first call. */
    initial?: string
    /** Name of the variable box. */
    target?: string
    /** Cell width in px, same knob as <MemoryCells>. */
    size?: number
    /** Tighter rhythm, for a slide with many calls that would otherwise overflow. */
    compact?: boolean
    /** Click at which the first call happens. */
    firstClick?: number
    /** Autoplay only: time on each call, ms. */
    stepMs?: number
    /** Autoplay only: pause on the last state before starting over, ms. */
    holdMs?: number
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  {
    typed: '9\n',
    steps: () => [],
    initial: 'Caracterele așteaptă în buffer, în ordinea în care au fost tastate.',
    target: 'variabila',
    size: 78,
    compact: false,
    firstClick: 1,
    stepMs: 2600,
    holdMs: 3600,
    color: 'blue-light',
  },
)

const chars = computed(() => Array.from(props.typed))

/** Where each step starts and ends in the buffer. */
const ranges = computed(() => {
  let at = 0
  return props.steps.map((s) => {
    const skip = s.fail ? 0 : (s.skip ?? 0)
    const take = s.fail ? 0 : (s.take ?? 0)
    const r = { start: at, skipEnd: at + skip, end: at + skip + take }
    at = r.end
    return r
  })
})

const { clicks, clicksTotal } = useNav()

/** No clicks on this slide at all: the reveals were stripped, so play alone. */
const selfDriven = computed(() => clicksTotal.value === 0)

/* autoplay, used only when nothing can advance us */

const autoDone = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined

function schedule() {
  const last = props.steps.length
  const wait = autoDone.value >= last ? props.holdMs : props.stepMs
  timer = setTimeout(() => {
    autoDone.value = autoDone.value >= last ? 0 : autoDone.value + 1
    schedule()
  }, wait)
}

// clicksTotal is not known at mount (it settles once the slide's v-clicks have
// registered), so start or stop the loop when the answer actually arrives.
watch(selfDriven, (alone) => {
  clearTimeout(timer)
  if (alone) {
    autoDone.value = 0
    schedule()
  }
}, { immediate: true })

onBeforeUnmount(() => clearTimeout(timer))

/** How many calls have already happened: 0 = the buffer as typed. */
const done = computed(() => {
  if (selfDriven.value)
    return autoDone.value
  const step = clicks.value - props.firstClick + 1
  return Math.min(props.steps.length, Math.max(0, step))
})

const active = computed(() => done.value - 1)
const activeStep = computed(() => (active.value >= 0 ? props.steps[active.value] : null))
const activeRange = computed(() => (active.value >= 0 ? ranges.value[active.value] : null))

/** First character nobody has taken yet: where the next call starts reading. */
const cursor = computed(() => (done.value === 0 ? 0 : ranges.value[active.value].end))

const caption = computed(() => activeStep.value?.note ?? props.initial)

/** One of: taken / skipped / next / past / ahead. Drives cell and tag. */
function fate(i: number) {
  const r = activeRange.value
  if (r && i >= r.start && i < r.end)
    return i < r.skipEnd ? 'skipped' : 'taken'
  if (i === cursor.value)
    return 'next'
  return i < cursor.value ? 'past' : 'ahead'
}

const TAGS: Record<string, string> = {
  taken: 'luat',
  skipped: 'sărit',
  next: 'urmează',
}

/** waiting (not run yet) / running / ran. */
function state(i: number) {
  if (i === active.value)
    return 'running'
  return i < active.value ? 'ran' : 'waiting'
}

function glyph(ch: string) {
  if (ch === '\n')
    return '\\n'
  if (ch === ' ')
    return '␣'
  if (ch === '\t')
    return '\\t'
  return ch
}

const isWhitespace = (ch: string) => ch === '\n' || ch === ' ' || ch === '\t'
</script>

<template>
  <div
    :class="[`neversink-${color}-scheme`, 'ns-buf', { 'is-compact': compact }]"
    :style="{ '--ns-buf-size': `${size}px` }"
  >
    <div class="ns-buf__main">
      <!-- 1. The calls as a little program: every line visible from the start,
           the running one marked the way a debugger marks it. -->
      <div class="ns-buf__code">
        <div class="ns-buf__code-bar">program.c</div>
        <div
          v-for="(s, i) in steps"
          :key="i"
          class="ns-buf__line"
          :class="[`is-${state(i)}`, { 'is-fail': s.fail && state(i) === 'running' }]"
        >
          <span class="ns-buf__ln">{{ i + 1 }}</span>
          <code class="ns-buf__src">{{ s.by }};</code>
          <span v-if="state(i) !== 'waiting' && s.ret" class="ns-buf__ret">{{ s.ret }}</span>
        </div>
      </div>

      <!-- 2. The buffer, drawn as what it is: a run of memory. -->
      <div class="ns-buf__board">
        <div class="ns-buf__tag-label">BUFFER · stdin</div>

        <div class="ns-buf__cells">
          <div v-for="(ch, i) in chars" :key="i" class="ns-buf__slot">
            <div class="ns-buf__cell" :class="[`is-${fate(i)}`, { 'is-ws': isWhitespace(ch) }]">
              {{ glyph(ch) }}
            </div>
            <div class="ns-buf__pos">{{ i }}</div>
            <div class="ns-buf__tag" :class="`is-${fate(i)}`">{{ TAGS[fate(i)] ?? '' }}</div>
          </div>
        </div>

        <div class="ns-buf__axis">poziția în buffer</div>
      </div>

      <!-- 3. What the taken characters became. -->
      <div class="ns-buf__out" :class="{ 'is-on': !!activeStep }">
        <span class="ns-buf__arrow">&rarr;</span>
        <div class="ns-buf__outbox">
          <div class="ns-buf__out-name">{{ target }}</div>
          <div
            class="ns-buf__var"
            :class="{ 'is-on': !!activeStep?.into, 'is-fail': activeStep?.fail }"
          >
            <span :key="activeStep?.into ?? 'none'">{{ activeStep?.into ?? 'neatinsă' }}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="ns-buf__caption" :class="{ 'is-fail': activeStep?.fail }">{{ caption }}</p>
  </div>
</template>

<style scoped>
.ns-buf {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  font-variant-numeric: tabular-nums;
}

/* --- the calls, drawn as a source file ----------------------------------- */

.ns-buf__main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

/* Beside the buffer, not above it: the slide is 16:9, so the width is what
   there is plenty of, and stacking these spent the scarce dimension. */
.ns-buf__code {
  display: flex;
  flex-direction: column;
  border: 1.5px solid var(--neversink-admon-border-color);
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 14px 30px -24px #000;
}

.ns-buf__code-bar {
  padding: 0.25rem 0.8rem;
  border-bottom: 1.5px solid var(--neversink-admon-border-color);
  background: color-mix(in srgb, var(--neversink-admon-bg-color) 45%, #fff);
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--neversink-text-color);
  opacity: 0.8;
}

.ns-buf__line {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.28rem 0.8rem 0.28rem 0;
  border-left: 3px solid transparent;
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1.05rem;
  color: var(--neversink-fg-color);
  transition: all 0.3s ease;
}

.ns-buf__ln {
  width: 1.6rem;
  text-align: right;
  font-size: 0.8rem;
  color: var(--neversink-text-color);
  opacity: 0.4;
  user-select: none;
}

.ns-buf__src {
  flex: 1;
  white-space: nowrap;
}

/* Not run yet: readable, so the students see what is coming. */
.ns-buf__line.is-waiting {
  opacity: 0.45;
}

/* Already run: it stays on screen, but it is history. */
.ns-buf__line.is-ran {
  opacity: 0.45;
}

/* The line the program is on, marked the way a debugger marks it. */
.ns-buf__line.is-running {
  opacity: 1;
  font-weight: 700;
  border-left-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
}

.ns-buf__line.is-fail .ns-buf__ret {
  background: transparent;
  border: 1.5px dashed var(--neversink-border-color);
  color: var(--neversink-fg-color);
}

.ns-buf__ret {
  padding: 0.05em 0.55em;
  border-radius: 999px;
  background: var(--neversink-border-color);
  color: #fff;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

.ns-buf__line.is-waiting .ns-buf__ret {
  visibility: hidden;
}

/* --- buffer and destination, side by side -------------------------------- */

.ns-buf__board {
  position: relative;
  padding: 1.5rem 1.2rem 0.7rem;
  border: 1.5px solid var(--neversink-admon-border-color);
  border-radius: 18px;
  background: color-mix(in srgb, var(--neversink-admon-bg-color) 30%, #fff);
  box-shadow: 0 14px 30px -24px #000;
}

.ns-buf__tag-label {
  position: absolute;
  top: -0.75rem;
  left: 1.2rem;
  padding: 0.15em 0.8em;
  border-radius: 999px;
  background: var(--neversink-border-color);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.ns-buf__cells {
  display: flex;
  justify-content: center;
}

.ns-buf__slot {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ns-buf__cell {
  display: grid;
  place-items: center;
  /* Fixed square, borders included: a two-glyph \n must not make its cell
     wider than a one-glyph 9, and a dashed border must not make it bigger than
     a solid one, or the strip stops reading as equal-sized storage. */
  box-sizing: border-box;
  width: var(--ns-buf-size);
  height: var(--ns-buf-size);
  border: 2px solid var(--neversink-admon-border-color);
  /* Cells touch, so the strip reads as one run rather than loose boxes. */
  margin-left: -1px;
  background: #fff;
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1.45rem;
  color: var(--neversink-fg-color);
  transition: all 0.35s cubic-bezier(0.34, 1.25, 0.64, 1);
}

/* A whitespace character is drawn smaller: it is there, but it is not content. */
.ns-buf__cell.is-ws {
  font-size: 1.35rem;
  color: var(--neversink-text-color);
}

/* Still waiting, nobody has looked at it. */
.ns-buf__cell.is-ahead {
  opacity: 0.9;
}

/* Where the next call will start reading. */
.ns-buf__cell.is-next {
  position: relative;
  z-index: 1;
  border-color: var(--neversink-fg-color);
  border-style: dashed;
}

/* Taken by an earlier call. Dimmed, never removed, so the walk stays readable. */
.ns-buf__cell.is-past {
  opacity: 0.28;
}

/* Skipped as whitespace by the current call: touched, but not used. */
.ns-buf__cell.is-skipped {
  opacity: 0.7;
  border-style: dotted;
  border-color: var(--neversink-border-color);
}

/* Taken by the current call. Solid fill: the one thing that cannot be missed
   from the back of the room. */
.ns-buf__cell.is-taken {
  position: relative;
  z-index: 2;
  border-color: var(--neversink-border-color);
  background: var(--neversink-border-color);
  color: #fff;
  font-weight: 700;
  /* Lift only. A scale here would make the taken cell a different size
     from its neighbours, and the strip must read as equal-sized storage. */
  transform: translateY(-8px);
  box-shadow: 0 14px 24px -12px var(--neversink-fg-color);
}

.ns-buf__pos {
  margin-top: 0.45rem;
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.8rem;
  color: var(--neversink-text-color);
  opacity: 0.5;
}

.ns-buf__tag {
  min-height: 1.2em;
  margin-top: 0.15rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--neversink-text-color);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ns-buf__tag.is-taken,
.ns-buf__tag.is-skipped {
  opacity: 1;
}

.ns-buf__tag.is-taken {
  color: var(--neversink-border-color);
}

.ns-buf__tag.is-next {
  opacity: 0.5;
}

/* The small numbers under the cells need to say what they are, the same way
   <MemoryCells> labels its address row. */
.ns-buf__axis {
  margin-top: 0.35rem;
  text-align: center;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--neversink-text-color);
  opacity: 0.55;
}

/* --- what came out of the call ------------------------------------------- */

.ns-buf__out {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.ns-buf__out.is-on {
  opacity: 1;
}

.ns-buf__arrow {
  font-size: 2.2rem;
  line-height: 1;
  color: var(--neversink-border-color);
}

.ns-buf__outbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.ns-buf__out-name {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--neversink-text-color);
  opacity: 0.7;
}

.ns-buf__var {
  display: grid;
  place-items: center;
  min-width: 10rem;
  padding: 0.75rem 1.1rem;
  white-space: nowrap;
  border: 2px dashed var(--neversink-admon-border-color);
  border-radius: 0.6rem;
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--neversink-text-color);
  transition: all 0.35s ease;
}

.ns-buf__var.is-on {
  border-style: solid;
  border-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
  color: var(--neversink-fg-color);
}

.ns-buf__var.is-fail {
  text-decoration: line-through;
  opacity: 0.65;
}

/* Keyed on the value, so a new value remounts the span and replays the pop. */
.ns-buf__var span {
  animation: ns-buf-pop 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
}

@keyframes ns-buf-pop {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.ns-buf__caption {
  margin: 0;
  min-height: 1.6em;
  max-width: 50rem;
  text-align: center;
  font-size: 1.05rem;
  color: var(--neversink-fg-color);
  opacity: 0.9;
}

.ns-buf__caption.is-fail {
  font-weight: 700;
  opacity: 1;
}

/* A slide with three calls plus a closing admonition runs out of room. */
.ns-buf.is-compact { gap: 0.5rem; }
.ns-buf.is-compact .ns-buf__line { font-size: 0.95rem; padding: 0.16rem 0.6rem 0.16rem 0; }

.ns-buf.is-compact .ns-buf__board { padding: 1.4rem 1.1rem 0.6rem; }
.ns-buf.is-compact .ns-buf__caption { font-size: 1rem; }

@media (prefers-reduced-motion: reduce) {
  .ns-buf__cell,
  .ns-buf__var,
  .ns-buf__instr { transition-duration: 0.01ms !important; }
  .ns-buf__var span { animation: none !important; }
}
</style>
