<script setup lang="ts">
import { computed } from 'vue'
import { currentSlug, deckUrl, neighbours } from '../lessons'

/**
 * End-of-deck navigation: previous lesson, hub, next lesson.
 *
 * Placed on the last slide of every deck. Because each deck is a separate
 * Slidev app, these are real page loads — not in-deck slide transitions.
 */
const slug = computed(() => currentSlug())
const around = computed(() => neighbours(slug.value))

const hubHref = computed(() => deckUrl(null, 2))
</script>

<template>
  <div class="deck-nav">
    <a v-if="around.prev" :href="deckUrl(around.prev.slug)" class="deck-nav-item prev">
      <span class="deck-nav-dir">← Lecția anterioară</span>
      <span class="deck-nav-title">{{ around.prev.icon }} {{ around.prev.title }}</span>
    </a>
    <span v-else class="deck-nav-spacer" />

    <a :href="hubHref" class="deck-nav-hub" title="Toate lecțiile">
      <mdi-view-grid-outline />
      <span>Toate lecțiile</span>
    </a>

    <a v-if="around.next" :href="deckUrl(around.next.slug)" class="deck-nav-item next">
      <span class="deck-nav-dir">Lecția următoare →</span>
      <span class="deck-nav-title">{{ around.next.icon }} {{ around.next.title }}</span>
    </a>
    <span v-else class="deck-nav-spacer" />
  </div>
</template>

<style scoped>
.deck-nav {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0.9rem;
  width: 100%;
  max-width: 52rem;
  margin-inline: auto;
}

.deck-nav-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(120, 113, 108, 0.3);
  border-radius: 8px;
  background: rgba(120, 113, 108, 0.06);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.deck-nav-item:hover {
  background: rgba(120, 113, 108, 0.14);
  border-color: rgba(120, 113, 108, 0.55);
  transform: translateY(-2px);
}

.deck-nav-item.next {
  text-align: right;
}

.deck-nav-spacer {
  flex: 1;
}

.deck-nav-dir {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.6;
}

.deck-nav-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--lesson-accent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deck-nav-hub {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  flex-shrink: 0;
  padding: 0.8rem 1.1rem;
  border: 1px dashed rgba(120, 113, 108, 0.4);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.deck-nav-hub:hover {
  border-color: rgba(120, 113, 108, 0.7);
  background: rgba(120, 113, 108, 0.1);
}
</style>
