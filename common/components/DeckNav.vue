<script setup lang="ts">
import { computed } from 'vue'
import { HUB_LESSONS_SLIDE, currentSlug, deckUrl, neighbours } from '../lessons'

/**
 * End-of-deck navigation: previous lesson, hub, next lesson.
 *
 * Placed on the last slide of every deck. Because each deck is a separate
 * Slidev app, these are real page loads — not in-deck slide transitions.
 */
const slug = computed(() => currentSlug())
const around = computed(() => neighbours(slug.value))

const hubHref = computed(() => deckUrl(null, HUB_LESSONS_SLIDE))
</script>

<template>
  <div class="deck-nav">
    <a v-if="around.prev" :href="deckUrl(around.prev.slug)" class="deck-nav-item prev">
      <span class="deck-nav-dir"><span class="deck-nav-arrow i-ph-arrow-left" /> Lecția anterioară</span>
      <span class="deck-nav-title"><span class="deck-nav-icon" :class="around.prev.icon" /> {{ around.prev.title }}</span>
    </a>
    <span v-else class="deck-nav-spacer" />

    <a :href="hubHref" class="deck-nav-hub" title="Toate lecțiile">
      <span class="deck-nav-icon i-ph-books-duotone" />
      <span>Toate lecțiile</span>
    </a>

    <a v-if="around.next" :href="deckUrl(around.next.slug)" class="deck-nav-item next">
      <span class="deck-nav-dir">Lecția următoare <span class="deck-nav-arrow i-ph-arrow-right" /></span>
      <span class="deck-nav-title"><span class="deck-nav-icon" :class="around.next.icon" /> {{ around.next.title }}</span>
    </a>
    <span v-else class="deck-nav-spacer" />
  </div>
</template>

<style scoped>
.deck-nav-icon,
.deck-nav-arrow {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  flex: none;
}

/* Colours come from the deck's Neversink scheme, so the nav follows whatever
   `color:` the deck sets instead of the hardcoded stone it used to carry. */
.deck-nav {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  max-width: 54rem;
  margin-inline: auto;
}

.deck-nav-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
  padding: 1.1rem 1.3rem;
  border: 1px solid var(--neversink-admon-border-color);
  border-radius: 12px;
  background: #fff;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 24px -20px #000;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.deck-nav-item:hover {
  border-color: var(--neversink-border-color);
  box-shadow: 0 16px 30px -18px var(--neversink-fg-color);
  transform: translateY(-3px);
}

.deck-nav-item.next {
  text-align: right;
}

.deck-nav-spacer {
  flex: 1;
}

.deck-nav-dir {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--neversink-text-color);
  opacity: 0.7;
}

.deck-nav-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--neversink-fg-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* The hub is the secondary action: filled accent, but small. */
.deck-nav-hub {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  flex-shrink: 0;
  padding: 1.1rem 1.4rem;
  border: none;
  border-radius: 12px;
  background: var(--neversink-admon-bg-color);
  color: var(--neversink-fg-color);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 600;
  transition: transform 0.18s ease, background 0.18s ease;
}

.deck-nav-hub svg {
  width: 1.4rem;
  height: 1.4rem;
}

.deck-nav-hub:hover {
  background: var(--neversink-border-color);
  color: #fff;
  transform: translateY(-3px);
}
</style>
