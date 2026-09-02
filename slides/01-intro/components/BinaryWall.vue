<script setup lang="ts">
/**
 * Machine code, made unbearable on purpose.
 *
 * Three claims about why nobody writes binary by hand, and each one is acted
 * out on the bytes themselves rather than asserted next to them:
 *
 *   1. there are millions of these  → a ×1.000.000 badge, and the wall keeps
 *      going past the bottom edge
 *   2. one wrong digit ruins it     → a single 0 flips to 1, in red, and it is
 *      genuinely hard to spot — which IS the argument (ask the class before
 *      pointing at it)
 *   3. it differs per processor     → the whole wall is replaced, byte by byte,
 *      with a different architecture's encoding
 *
 * Follows the slide's clicks while the lesson is being taught; loops on its own
 * in archived decks where the reveals are stripped. See the `slide-reveals`
 * skill.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNav } from '@slidev/client'

const props = withDefaults(
  defineProps<{
    /** Click at which the wall itself appears. */
    firstClick?: number
    /** Autoplay only: time per step, ms. */
    stepMs?: number
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  { firstClick: 1, stepMs: 2000, color: 'blue-light' },
)

const LAST = 4

const ARCHS = [
  {
    name: 'x86-64',
    rows: [
      ['01010101', '01001000', '10001001', '11100101'],
      ['10111000', '00000000', '00000000', '00000000'],
      ['01011101', '11000011', '10010000', '11110011'],
    ],
  },
  {
    name: 'ARM64',
    rows: [
      ['11111101', '01111011', '10111111', '10101001'],
      ['11010010', '10000000', '00000000', '00000000'],
      ['10100000', '00000011', '11100001', '00000011'],
    ],
  },
]

/** The digit that gets corrupted at step 3: row, byte, bit. */
const FLIP = { row: 1, byte: 1, bit: 3 }

/* ── the step ──────────────────────────────────────────────────────────── */

const { clicks, clicksTotal } = useNav()
const selfDriven = computed(() => clicksTotal.value === 0)

const autoStep = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

watch(selfDriven, (alone) => {
  clearInterval(timer)
  if (!alone)
    return
  autoStep.value = 0
  timer = setInterval(() => {
    autoStep.value = autoStep.value >= LAST + 1 ? 0 : autoStep.value + 1
  }, props.stepMs)
}, { immediate: true })

onBeforeUnmount(() => clearInterval(timer))

const step = computed(() => {
  const raw = selfDriven.value ? autoStep.value : clicks.value - props.firstClick + 1
  return Math.min(LAST, Math.max(0, raw))
})

/* ── what each step shows ──────────────────────────────────────────────── */

const arch = computed(() => (step.value >= 4 ? ARCHS[1] : ARCHS[0]))
const rows = computed(() => arch.value.rows)

const isFlipped = (r: number, b: number, c: number) =>
  step.value >= 3 && r === FLIP.row && b === FLIP.byte && c === FLIP.bit

/** The corrupted digit reads 1 where the real encoding has 0. */
function bit(row: number, byte: number, index: number) {
  const original = rows.value[row][byte][index]
  return isFlipped(row, byte, index) ? '1' : original
}
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-bin']" :style="{ opacity: step >= 1 ? 1 : 0 }">
    <div class="ns-bin__board">
      <span class="ns-bin__arch" :key="arch.name">{{ arch.name }}</span>

      <div class="ns-bin__rows">
        <div v-for="(row, r) in rows" :key="r" class="ns-bin__row">
          <span
            v-for="(byte, b) in row" :key="`${arch.name}-${r}-${b}`" class="ns-bin__byte"
            :style="{ animationDelay: `${(r * 4 + b) * 0.05}s` }"
          >
            <span
              v-for="(ch, c) in byte.split('')" :key="c"
              class="ns-bin__bit" :class="{ 'is-flipped': isFlipped(r, b, c) }"
            >{{ bit(r, b, c) }}</span>
          </span>
        </div>
      </div>

      <!-- step 2: the wall does not stop at the bottom edge -->
      <div class="ns-bin__more" :class="{ 'is-on': step >= 2 }">
        <div v-for="g in 2" :key="g" class="ns-bin__row ns-bin__row--ghost">
          <span v-for="(byte, b) in rows[0]" :key="b" class="ns-bin__byte">{{ byte }}</span>
        </div>
      </div>

      <!-- step 2: how many of these a real program has -->
      <div class="ns-bin__badge" :class="{ 'is-on': step >= 2 }">× 1.000.000</div>
    </div>
  </div>
</template>

<style scoped>
.ns-bin {
  transition: opacity 0.4s ease;
}

.ns-bin__board {
  position: relative;
  padding: 1.5rem 1.75rem 1.25rem;
  border: 1px solid var(--neversink-admon-border-color);
  border-radius: 0.75rem;
  background: var(--neversink-admon-bg-color);
  overflow: hidden;
}

.ns-bin__arch {
  position: absolute;
  top: 0.5rem;
  left: 0.9rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--neversink-text-color);
  opacity: 0.65;
  animation: ns-bin-fade 0.4s ease;
}

.ns-bin__rows,
.ns-bin__more {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
}

.ns-bin__row {
  display: flex;
  gap: 1.1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  /* Big enough to read from the back — the point is that it is unreadable
     as MEANING, not that it is unreadable as pixels. */
  font-size: 1.55rem;
  line-height: 1.35;
  letter-spacing: 0.06em;
  color: var(--neversink-fg-color);
}

/* Bytes remount when the architecture changes (they are keyed on it), which
   replays this stagger — the wall visibly rewrites itself. */
.ns-bin__byte {
  animation: ns-bin-swap 0.45s cubic-bezier(0.34, 1.2, 0.64, 1) backwards;
}

.ns-bin__bit {
  transition: color 0.3s ease;
}

.ns-bin__bit.is-flipped {
  color: #d92d20;
  font-weight: 700;
  animation: ns-bin-flip 0.5s cubic-bezier(0.34, 1.4, 0.64, 1);
}

/* The continuation: dimmer and shorter each row, fading into the board edge. */
.ns-bin__more {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.5s ease, opacity 0.5s ease, margin-top 0.5s ease;
}

.ns-bin__more.is-on {
  max-height: 6rem;
  margin-top: 0.4rem;
  opacity: 1;
  -webkit-mask-image: linear-gradient(to bottom, #000, transparent);
  mask-image: linear-gradient(to bottom, #000, transparent);
}

.ns-bin__row--ghost {
  opacity: 0.5;
}

.ns-bin__badge {
  position: absolute;
  top: 50%;
  right: 1rem;
  padding: 0.35rem 0.8rem;
  border: 2px solid var(--neversink-border-color);
  border-radius: 999px;
  background: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--neversink-fg-color);
  opacity: 0;
  transform: translate(1.5rem, -50%) scale(0.7);
  transition: all 0.45s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.ns-bin__badge.is-on {
  opacity: 1;
  transform: translate(0, -50%) scale(1);
}

@keyframes ns-bin-flip {
  from { transform: scale(2.1); }
  to { transform: scale(1); }
}

@keyframes ns-bin-swap {
  from { opacity: 0; transform: translateY(-0.5rem); }
  to { opacity: 1; transform: none; }
}

@keyframes ns-bin-fade {
  from { opacity: 0; }
  to { opacity: 0.65; }
}

@media (prefers-reduced-motion: reduce) {
  .ns-bin *, .ns-bin { transition-duration: 0.01ms !important; animation: none !important; }
}
</style>
