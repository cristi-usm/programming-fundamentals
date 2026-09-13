<script setup lang="ts">
/**
 * A format specifier taken apart.
 *
 * `%-8.2f` looks like noise until you see that it is five decisions written
 * next to each other, each one optional except the first and the last. Drawn as
 * labelled boxes, the students can read any specifier they meet afterwards
 * instead of memorising the handful we happened to show.
 *
 * Static on purpose: it is a diagram, not a process, so there is nothing to
 * pace and nothing to autoplay.
 */
withDefaults(
  defineProps<{
    /** The pieces, left to right. `optional` draws the box dashed. */
    parts?: { text: string, label: string, optional?: boolean }[]
    /** One line under the diagram. */
    caption?: string
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  { parts: () => [], caption: '', color: 'blue-light' },
)
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-spec']">
    <div class="ns-spec__row">
      <div v-for="(part, i) in parts" :key="i" class="ns-spec__part">
        <div class="ns-spec__box" :class="{ 'is-optional': part.optional }">
          {{ part.text }}
        </div>
        <div class="ns-spec__stem" />
        <div class="ns-spec__label">
          {{ part.label }}
          <div v-if="part.optional" class="ns-spec__opt">opțional</div>
        </div>
      </div>
    </div>

    <p v-if="caption" class="ns-spec__caption">{{ caption }}</p>
  </div>
</template>

<style scoped>
.ns-spec {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.ns-spec__row {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}

.ns-spec__part {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 7.5rem;
}

.ns-spec__box {
  display: grid;
  place-items: center;
  min-width: 3.2rem;
  padding: 0.35rem 0.7rem;
  border: 2px solid var(--neversink-border-color);
  border-radius: 0.5rem;
  background: var(--neversink-admon-bg-color);
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--neversink-fg-color);
}

/* Dashed: the specifier still works without this piece. */
.ns-spec__box.is-optional {
  border-style: dashed;
  background: transparent;
}

.ns-spec__stem {
  width: 2px;
  height: 1.1rem;
  background: var(--neversink-admon-border-color);
}

.ns-spec__label {
  text-align: center;
  font-size: 0.8rem;
  line-height: 1.25;
  color: var(--neversink-text-color);
}

.ns-spec__opt {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
}

.ns-spec__caption {
  margin: 0;
  font-size: 0.9rem;
  text-align: center;
  color: var(--neversink-fg-color);
  opacity: 0.8;
}
</style>
