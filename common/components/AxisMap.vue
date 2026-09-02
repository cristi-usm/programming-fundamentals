<script setup lang="ts">
/**
 * A 2D map: two axes crossing in the middle, four named zones, items placed as
 * labelled chips.
 *
 * Generic on purpose — anything best explained as "this one is more X and less Y
 * than that one": languages by level and typing, data structures by lookup and
 * insert cost, editors by power and learning curve.
 *
 *   <AxisMap
 *     x-label="Tipare" x-min="dinamic" x-max="strict"
 *     y-label="Nivel"  y-min="jos"     y-max="înalt"
 *     :zones="['ușor de scris', 'sigur și abstract', 'verificat de compiler', 'aproape de mașină']"
 *     :items="[
 *       { x: 60, y: 18, label: 'C', highlight: true },
 *       { x: 30, y: 90, label: 'Python' },
 *     ]"
 *   />
 *
 * Coordinates are 0–100 in both directions, origin bottom-left, so the axes
 * cross at (50, 50). Each item is a <Chip>, which finds its own logo — the label
 * always travels with the marker instead of floating next to it.
 *
 * It is plain HTML rather than SVG: chips are the same component used in prose,
 * text scales with the deck's type, and long labels wrap instead of colliding.
 */
import Chip from './Chip.vue'

export interface AxisMapItem {
  /** 0 (left) – 100 (right). */
  x: number
  /** 0 (bottom) – 100 (top). */
  y: number
  label: string
  /** The one the slide is about: accent border, filled, larger. */
  highlight?: boolean
  /** Icon registry key, when it differs from the label. */
  icon?: string | false
}

withDefaults(
  defineProps<{
    items: AxisMapItem[]
    /** Axis names, at the arrow tips. */
    xLabel?: string
    yLabel?: string
    /** End captions, at the extremities of each axis. */
    xMin?: string
    xMax?: string
    yMin?: string
    yMax?: string
    /** Zone captions, from top-left, clockwise. Each zone is tinted. */
    zones?: string[]
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
    /** Drawing height in px; width is always 100% of the container. */
    height?: number
  }>(),
  {
    xLabel: '',
    yLabel: '',
    xMin: '',
    xMax: '',
    yMin: '',
    yMax: '',
    zones: () => [],
    color: 'blue-light',
    height: 440,
  },
)
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-axismap']">
    <div class="ns-axismap__plot" :style="{ height: `${height}px` }">
      <!-- Four named zones, each captioned in its own outer corner so a label
           can never sit where the axes (and therefore the items) crowd. -->
      <div class="ns-axismap__zones">
        <div v-for="(zone, i) in [zones[0], zones[1], zones[3], zones[2]]" :key="i"
          :class="['ns-axismap__zone', `ns-axismap__zone--${i}`]">
          <span v-if="zone" class="ns-axismap__zone-label">{{ zone }}</span>
        </div>
      </div>

      <!-- The axes cross in the middle. -->
      <div class="ns-axismap__axis ns-axismap__axis--x" />
      <div class="ns-axismap__axis ns-axismap__axis--y" />

      <span v-if="yMax" class="ns-axismap__end ns-axismap__end--top">{{ yMax }} ↑</span>
      <span v-if="yMin" class="ns-axismap__end ns-axismap__end--bottom">{{ yMin }} ↓</span>
      <span v-if="xMin" class="ns-axismap__end ns-axismap__end--left">← {{ xMin }}</span>
      <span v-if="xMax" class="ns-axismap__end ns-axismap__end--right">{{ xMax }} →</span>

      <span v-if="yLabel" class="ns-axismap__axis-name ns-axismap__axis-name--y">{{ yLabel }}</span>
      <span v-if="xLabel" class="ns-axismap__axis-name ns-axismap__axis-name--x">{{ xLabel }}</span>

      <!-- Items -->
      <div v-for="item in items" :key="item.label" class="ns-axismap__item"
        :style="{ left: `${item.x}%`, bottom: `${item.y}%` }">
        <Chip :icon="item.icon" :emphasis="item.highlight" :color="color"
          :class="{ 'ns-axismap__chip--highlight': item.highlight }">{{ item.label }}</Chip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ns-axismap {
  width: 100%;
  /* Left and bottom gutters hold the frame captions, so nothing that names an
     axis ever shares space with an item. */
  padding: 0.5rem 1rem 3.4rem 5.2rem;
}

.ns-axismap__plot {
  position: relative;
  width: 100%;
}

.ns-axismap__zones {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template: 1fr 1fr / 1fr 1fr;
  border-radius: 14px;
  overflow: hidden;
}

.ns-axismap__zone {
  position: relative;
  background: var(--neversink-admon-bg-color);
}

/* Diagonal pairs share a weight, so the eye reads two trade-offs rather than
   four unrelated boxes. */
.ns-axismap__zone--0,
.ns-axismap__zone--3 {
  opacity: 0.5;
}

.ns-axismap__zone--1,
.ns-axismap__zone--2 {
  opacity: 0.22;
}

/* Each caption hugs the corner furthest from the crossing point. */
.ns-axismap__zone-label {
  position: absolute;
  max-width: 46%;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--neversink-text-color);
  opacity: 0.6;
}

.ns-axismap__zone--0 .ns-axismap__zone-label {
  top: 0.8rem;
  left: 1rem;
}

.ns-axismap__zone--1 .ns-axismap__zone-label {
  top: 0.8rem;
  right: 1rem;
  text-align: right;
}

.ns-axismap__zone--2 .ns-axismap__zone-label {
  bottom: 0.8rem;
  left: 1rem;
}

.ns-axismap__zone--3 .ns-axismap__zone-label {
  bottom: 0.8rem;
  right: 1rem;
  text-align: right;
}

.ns-axismap__axis {
  position: absolute;
  background: var(--neversink-border-color);
  opacity: 0.5;
}

.ns-axismap__axis--x {
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
}

.ns-axismap__axis--y {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
}

/* Axis names: the loudest part of the frame, since they carry the meaning. */
.ns-axismap__axis-name {
  position: absolute;
  padding: 0.15em 0.75em;
  border-radius: 999px;
  background: var(--neversink-border-color);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
}

.ns-axismap__axis-name--x {
  left: 50%;
  bottom: -2.9rem;
  transform: translateX(-50%);
}

.ns-axismap__axis-name--y {
  left: -3.6rem;
  top: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
}

/* End captions: quiet outlined pills, upright on both axes so they stay
   readable — a rotated "jos ↓" is a puzzle, not a label. */
.ns-axismap__end {
  position: absolute;
  padding: 0.15em 0.7em;
  border: 1px solid var(--neversink-admon-border-color);
  border-radius: 999px;
  background: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--neversink-text-color);
  opacity: 0.85;
  white-space: nowrap;
}

.ns-axismap__end--top {
  right: calc(100% + 0.9rem);
  top: -0.4rem;
}

.ns-axismap__end--bottom {
  right: calc(100% + 0.9rem);
  bottom: -0.4rem;
}

.ns-axismap__end--left {
  left: 0;
  bottom: -2.7rem;
}

.ns-axismap__end--right {
  right: 0;
  bottom: -2.7rem;
}

.ns-axismap__item {
  position: absolute;
  z-index: 1;
  transform: translate(-50%, 50%);
  font-size: 1.05rem;
}

/* Chips on the map need more presence than chips in a paragraph. */
.ns-axismap__item :deep(.ns-chip) {
  padding: 0.3em 0.75em;
  font-size: 1em;
  box-shadow: 0 4px 14px -8px #000;
}

.ns-axismap__item :deep(.ns-chip__icon) {
  width: 1.35em;
  height: 1.35em;
}

.ns-axismap__item :deep(.ns-chip--emphasis) {
  border-width: 2px;
  padding: 0.4em 1em;
  font-size: 1.25em;
  box-shadow: 0 8px 22px -10px var(--neversink-fg-color);
}
</style>
