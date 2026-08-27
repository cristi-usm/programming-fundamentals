<script setup lang="ts">
import { computed } from 'vue'
import { MODULES, labsOfModule } from '../labs'
import LabCard from './LabCard.vue'

/**
 * The hub's table of contents: one column per module, driven entirely by
 * common/labs.json. Adding a lab to the registry makes it appear here.
 */
const columns = computed(() =>
  MODULES.map(module => ({ module, labs: labsOfModule(module.id) }))
)
</script>

<template>
  <div class="lab-grid">
    <div v-for="column in columns" :key="column.module.id" class="lab-column">
      <div class="lab-column-head">
        <span class="lab-column-emoji">{{ column.module.emoji }}</span>
        <span class="lab-column-title">{{ column.module.title }}</span>
      </div>
      <LabCard v-for="lab in column.labs" :key="lab.slug" :slug="lab.slug" />
    </div>
  </div>
</template>

<style scoped>
.lab-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: start;
  text-align: left;
}

.lab-column {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
}

.lab-column-head {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  padding-bottom: 0.25rem;
  margin-bottom: 0.1rem;
  border-bottom: 1px solid rgba(120, 113, 108, 0.25);
}

.lab-column-emoji {
  font-size: 0.9rem;
}

.lab-column-title {
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.8;
}
</style>
