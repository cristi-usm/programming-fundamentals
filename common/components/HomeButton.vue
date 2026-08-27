<script setup lang="ts">
import { computed } from 'vue'
import { currentSlug, deckUrl } from '../labs'

// Slide 2 of the hub is the lab grid; the hub itself needs no button to itself.
const href = computed(() => (currentSlug() === null ? null : deckUrl(null, 2)))
</script>

<template>
  <div v-if="href" class="fixed top-4 left-4 z-50">
    <a :href="href" class="home-btn" title="Înapoi la laboratoare">
      <mdi-home-outline />
    </a>
  </div>
</template>

<style scoped>
.home-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 16px;
}

.home-btn:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
</style>
