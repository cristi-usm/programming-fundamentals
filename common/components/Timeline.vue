<script setup lang="ts">
/**
 * A horizontal timeline: a line, one marker per moment, the year above and a
 * short caption below.
 *
 *   <Timeline :items="[
 *     { year: '1972', label: 'C apare la Bell Labs', note: 'Dennis Ritchie' },
 *     { year: '2024', label: 'C23', highlight: true },
 *   ]" />
 *
 * Positions are the order of the array, not the distance between the years —
 * a timeline on a slide is a sequence, not a chart. Use `<AxisMap>` when the
 * spacing itself carries meaning.
 */
export interface TimelineItem {
  year: string
  label: string
  /** Second line under the label — who, or what changed. */
  note?: string
  /** The moment the slide is about: filled marker, accent year. */
  highlight?: boolean
}

withDefaults(
  defineProps<{
    items: TimelineItem[]
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  { color: 'blue-light' },
)
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-timeline']">
    <div class="ns-timeline__line" />
    <div class="ns-timeline__items">
      <div v-for="(item, i) in items" :key="i" class="ns-timeline__item"
        :style="{ animationDelay: `${i * 0.12}s` }">
        <div :class="['ns-timeline__year', { 'ns-timeline__year--on': item.highlight }]">
          {{ item.year }}
        </div>
        <div :class="['ns-timeline__dot', { 'ns-timeline__dot--on': item.highlight }]" />
        <div class="ns-timeline__label">{{ item.label }}</div>
        <div v-if="item.note" class="ns-timeline__note">{{ item.note }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ns-timeline {
  position: relative;
  width: 100%;
  padding: 0.5rem 0 0.25rem;
}

/* The line sits behind the markers, at the height of the dot row. */
.ns-timeline__line {
  position: absolute;
  left: 0;
  right: 0;
  top: 2.55rem;
  height: 2px;
  background: var(--neversink-border-color);
  opacity: 0.35;
}

.ns-timeline__items {
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-items: start;
}

.ns-timeline__item {
  text-align: center;
  padding: 0 0.4rem;
  animation: ns-timeline-in 0.4s ease-out both;
}

.ns-timeline__year {
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.4;
  color: var(--neversink-text-color);
  opacity: 0.75;
}

.ns-timeline__year--on {
  color: var(--neversink-fg-color);
  opacity: 1;
}

.ns-timeline__dot {
  width: 13px;
  height: 13px;
  margin: 0.35rem auto 0.6rem;
  border: 2px solid var(--neversink-border-color);
  border-radius: 999px;
  background: #fff;
}

.ns-timeline__dot--on {
  width: 17px;
  height: 17px;
  margin-top: 0.2rem;
  border-color: var(--neversink-fg-color);
  background: var(--neversink-fg-color);
  box-shadow: 0 0 0 4px var(--neversink-admon-bg-color);
}

.ns-timeline__label {
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--neversink-text-color);
}

.ns-timeline__note {
  margin-top: 0.15rem;
  font-size: 0.75rem;
  line-height: 1.3;
  opacity: 0.7;
}

@keyframes ns-timeline-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ns-timeline__item {
    animation: none;
  }
}
</style>
