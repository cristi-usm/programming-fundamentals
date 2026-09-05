<script setup lang="ts">
/**
 * Binary positional notation, drawn and clickable.
 *
 * Each bit is a box; above it sits the value of that position (128, 64, … 1).
 * Under the row, the bits that are ON are added up, so the class watches the
 * number being BUILT rather than being told the answer:
 *
 *   64 + 1 = 65
 *
 * Clicking a bit toggles it, which is the point in a lecture: ask the class for
 * a number, then flip bits until it appears.
 *
 *   <BinaryNumber :value="65" show-char />
 *   <BinaryNumber :value="0" :bits="4" :interactive="false" />
 */
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Starting value. */
    value?: number
    /** How many bit boxes. 8 = one byte. */
    bits?: number
    /** Click to flip a bit. Off for a static illustration. */
    interactive?: boolean
    /** Show the "64 + 1 = 65" line under the boxes. */
    showSum?: boolean
    /** Show each position as a power of two above its value. */
    showPowers?: boolean
    /** Two's complement: the leftmost position counts NEGATIVE. */
    signed?: boolean
    /** Also show the ASCII character for the value. */
    showChar?: boolean
    /** Caption under the whole thing. */
    caption?: string
    color?: string
  }>(),
  {
    value: 0,
    bits: 8,
    interactive: true,
    showSum: true,
    showPowers: true,
    signed: false,
    showChar: false,
    caption: '',
    color: 'blue-light',
  },
)

/** Most significant bit first, so it reads left to right like a written number. */
const on = ref<boolean[]>([])

function load(v: number) {
  on.value = Array.from({ length: props.bits }, (_, i) => ((v >> (props.bits - 1 - i)) & 1) === 1)
}
load(props.value)
watch(() => [props.value, props.bits], () => load(props.value))

/**
 * Two's complement needs no new machinery: it is the same positional sum with the
 * leftmost place counting negative. Build 11111111 in `signed` mode and the sum
 * runs -128 + 64 + … + 1 = -1, which is the whole trick, visible.
 */
const place = (i: number) => {
  const v = 2 ** (props.bits - 1 - i)
  return props.signed && i === 0 ? -v : v
}
/** The exponent is where the place value COMES FROM, so it is shown, not implied. */
const exponent = (i: number) => props.bits - 1 - i
const total = computed(() => on.value.reduce((s, b, i) => (b ? s + place(i) : s), 0))
const addends = computed(() => on.value.map((b, i) => (b ? place(i) : 0)).filter(Boolean))

/** Only the printable ASCII range has a glyph worth showing; the rest show nothing
    rather than a placeholder, which would read as a value the number does have. */
const asChar = computed(() => {
  const t = total.value
  if (t < 0) return ''
  if (t === 32) return 'spațiu'
  return t > 32 && t < 127 ? String.fromCharCode(t) : ''
})

function flip(i: number) {
  if (props.interactive) on.value[i] = !on.value[i]
}
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-bin']">
    <div class="ns-bin__row">
      <div v-for="(bit, i) in on" :key="i" class="ns-bin__col">
        <div v-if="showPowers" :class="['ns-bin__pow', { 'ns-bin__pow--on': bit }]">
          <span v-if="signed && i === 0">−</span>2<sup>{{ exponent(i) }}</sup>
        </div>
        <div :class="['ns-bin__place', { 'ns-bin__place--on': bit }]">{{ place(i) }}</div>
        <button
          type="button"
          :class="['ns-bin__bit', { 'ns-bin__bit--on': bit, 'ns-bin__bit--live': interactive }]"
          :disabled="!interactive"
          @click="flip(i)"
        >
          {{ bit ? 1 : 0 }}
        </button>
      </div>
    </div>

    <div v-if="showSum" class="ns-bin__sum">
      <template v-if="addends.length">
        <span v-for="(a, i) in addends" :key="a">
          <span v-if="i" class="ns-bin__plus">+</span>
          <span :class="['ns-bin__addend', { 'ns-bin__addend--neg': a < 0 }]">{{ a }}</span>
        </span>
      </template>
      <span v-else class="ns-bin__addend ns-bin__addend--zero">0</span>
      <span class="ns-bin__eq">=</span>
      <span class="ns-bin__total">{{ total }}</span>
      <span v-if="showChar && asChar" class="ns-bin__char">{{ asChar }}</span>
    </div>

    <div v-if="interactive" class="ns-bin__hint">apăsați pe un bit ca să-l schimbați</div>
    <div v-if="caption" class="ns-bin__caption">{{ caption }}</div>
  </div>
</template>

<style scoped>
.ns-bin {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ns-bin__row {
  display: flex;
  gap: 0.4rem;
}

.ns-bin__col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* The place value is the whole lesson: a bit is not "a 1", it is "a 64". */
.ns-bin__pow {
  font-family: monospace;
  font-size: 0.72rem;
  font-weight: 700;
  opacity: 0.28;
  transition: opacity 0.2s ease, color 0.2s ease;
  color: var(--neversink-text-color);
}

.ns-bin__pow sup {
  font-size: 0.62em;
}

.ns-bin__pow--on {
  opacity: 0.85;
  color: var(--neversink-fg-color);
}

.ns-bin__place {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.35;
  transition: opacity 0.2s ease, color 0.2s ease;
  color: var(--neversink-text-color);
}

.ns-bin__place--on {
  opacity: 1;
  color: var(--neversink-fg-color);
}

.ns-bin__col .ns-bin__place {
  margin-bottom: 0.3rem;
}

.ns-bin__bit {
  width: 2.9rem;
  height: 2.9rem;
  border: 2px solid var(--neversink-admon-border-color);
  border-radius: 10px;
  background: #fff;
  font-family: monospace;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--neversink-text-color);
  opacity: 0.55;
  transition: all 0.18s ease;
}

.ns-bin__bit--live {
  cursor: pointer;
}

.ns-bin__bit--live:hover {
  transform: translateY(-2px);
  border-color: var(--neversink-border-color);
}

/* Solid, not tinted: from the back of a lecture hall a faint background reads as
   the same box, and the whole point is which switches are ON. */
.ns-bin__bit--on {
  opacity: 1;
  border-color: var(--neversink-border-color);
  background: var(--neversink-border-color);
  color: #fff;
  box-shadow: 0 8px 18px -12px var(--neversink-fg-color);
}

.ns-bin__sum {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  margin-top: 1rem;
  font-family: monospace;
  font-size: 1.4rem;
}

.ns-bin__plus {
  margin: 0 0.35rem;
  opacity: 0.5;
}

.ns-bin__addend {
  font-weight: 700;
  color: var(--neversink-fg-color);
}

.ns-bin__addend--neg {
  color: var(--neversink-text-color);
}

.ns-bin__addend--zero {
  opacity: 0.45;
  color: var(--neversink-text-color);
}

.ns-bin__eq {
  opacity: 0.5;
}

.ns-bin__total {
  padding: 0.05em 0.6em;
  border-radius: 8px;
  background: var(--neversink-border-color);
  color: #fff;
  font-size: 1.6rem;
  font-weight: 800;
}

.ns-bin__char {
  margin-left: 0.6rem;
  padding: 0.05em 0.6em;
  border: 2px dashed var(--neversink-border-color);
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--neversink-text-color);
}

.ns-bin__hint {
  margin-top: 0.6rem;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.5;
}

.ns-bin__caption {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  opacity: 0.75;
}
</style>
