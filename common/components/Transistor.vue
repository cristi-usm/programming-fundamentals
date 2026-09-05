<script setup lang="ts">
/**
 * A transistor letting current through, or not.
 *
 * The claim "a computer is made of switches" is asserted on every intro slide and
 * almost never shown. Here the gate opens and closes on its own, the current
 * visibly flows or stops, and the bulb answers with 1 or 0 — which is the whole
 * argument for why the machine has exactly two digits.
 *
 * It runs by itself so it works in an archived deck with no clicks left, and a
 * click freezes it on one state for when the presenter wants to hold one.
 *
 * Drawn in HTML rather than SVG on purpose: a global reset sets `display: block`
 * on SVG children, which takes <text> out of SVG positioning and made the labels
 * paint nowhere. Divs have no such argument with the page.
 *
 *   <Transistor />
 *   <Transistor :autoplay="false" :on="true" />
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Starting state. */
    on?: boolean
    /** Flip by itself. Off leaves it fixed on `on`. */
    autoplay?: boolean
    /** Milliseconds per state. */
    interval?: number
    color?: string
  }>(),
  { on: true, autoplay: true, interval: 2600, color: 'blue-light' },
)

const open = ref(props.on)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (props.autoplay) timer = setInterval(() => (open.value = !open.value), props.interval)
})
onBeforeUnmount(() => clearInterval(timer))

/** A click takes over: holding one state beats waiting for the loop to come back. */
function toggle() {
  clearInterval(timer)
  timer = undefined
  open.value = !open.value
}
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-tr']" @click="toggle">
    <div class="ns-tr__row">
      <div class="ns-tr__terminal">
        <span class="ns-tr__terminal-bar" />
        <span class="ns-tr__cap">curent</span>
      </div>

      <div :class="['ns-tr__wire', { 'ns-tr__wire--flow': open }]" />

      <div class="ns-tr__gate">
        <div :class="['ns-tr__box', { 'ns-tr__box--on': open }]">{{ open ? 1 : 0 }}</div>
        <div :class="['ns-tr__stem', { 'ns-tr__stem--on': open }]" />
        <div class="ns-tr__cap">poartă</div>
      </div>

      <div :class="['ns-tr__wire', { 'ns-tr__wire--flow': open }]" />

      <div :class="['ns-tr__bulb', { 'ns-tr__bulb--on': open }]">{{ open ? 1 : 0 }}</div>
    </div>

    <div class="ns-tr__caption">
      <span :class="{ 'ns-tr__caption--dim': !open }">poarta deschisă: curentul trece, bitul este <b>1</b></span>
      <span class="ns-tr__sep" />
      <span :class="{ 'ns-tr__caption--dim': open }">poarta închisă: curentul nu trece, bitul este <b>0</b></span>
    </div>
  </div>
</template>

<style scoped>
.ns-tr {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  user-select: none;
  color: var(--neversink-text-color);
}

.ns-tr__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 34rem;
}

.ns-tr__terminal {
  position: relative;
  flex: none;
}

.ns-tr__terminal-bar {
  display: block;
  width: 4px;
  height: 2rem;
  border-radius: 2px;
  background: var(--neversink-admon-border-color);
}

/* Labels hang below their piece without adding to the row's height, so the wire
   stays on the vertical centre of everything. */
.ns-tr__cap {
  position: absolute;
  top: calc(100% + 0.3rem);
  left: 50%;
  transform: translateX(-50%);
  font-family: monospace;
  font-size: 0.72rem;
  white-space: nowrap;
  opacity: 0.65;
}

.ns-tr__wire {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--neversink-admon-border-color);
}

/* Moving dashes are the only thing that says "flowing" rather than "connected",
   which is exactly the distinction the slide is making. */
.ns-tr__wire--flow {
  background: repeating-linear-gradient(
    90deg,
    var(--neversink-fg-color) 0 12px,
    transparent 12px 26px
  );
  background-size: 26px 100%;
  animation: ns-tr-flow 0.7s linear infinite;
}

@keyframes ns-tr-flow {
  to { background-position: 26px 0; }
}

.ns-tr__gate {
  position: relative;
  flex: none;
  padding-bottom: 0;
}

.ns-tr__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 2.6rem;
  border: 2.5px solid var(--neversink-admon-border-color);
  border-radius: 8px;
  background: #fff;
  font-family: monospace;
  font-size: 1.25rem;
  font-weight: 800;
  transition: all 0.2s ease;
}

.ns-tr__box--on {
  border-color: var(--neversink-fg-color);
  background: var(--neversink-admon-bg-color);
  color: var(--neversink-fg-color);
}

.ns-tr__stem {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 4px;
  height: 1.8rem;
  transform: translateX(-50%);
  border-radius: 2px;
  background: var(--neversink-admon-border-color);
  transition: background 0.2s ease;
}

.ns-tr__stem--on {
  background: var(--neversink-fg-color);
}

.ns-tr__gate .ns-tr__cap {
  top: calc(100% + 2.1rem);
}

.ns-tr__bulb {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 2.6rem;
  height: 2.6rem;
  border: 2.5px solid var(--neversink-admon-border-color);
  border-radius: 999px;
  background: #fff;
  font-family: monospace;
  font-size: 1.15rem;
  font-weight: 800;
  opacity: 0.55;
  transition: all 0.2s ease;
}

.ns-tr__bulb--on {
  border-color: var(--neversink-fg-color);
  background: var(--neversink-fg-color);
  color: #fff;
  opacity: 1;
  box-shadow: 0 0 18px -2px color-mix(in srgb, var(--neversink-fg-color) 60%, transparent);
}

/* Clears the gate's stem and its label, both of which hang below the row without
   taking part in its height. */
.ns-tr__caption {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-top: 4rem;
  font-size: 0.8rem;
}

.ns-tr__caption--dim {
  opacity: 0.35;
}

.ns-tr__sep {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.4;
}
</style>
