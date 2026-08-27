<script setup lang="ts">
import { computed } from 'vue'
import { MODULES, lessonsOfModule } from '../lessons'
import LessonCard from './LessonCard.vue'

/**
 * The hub's table of contents: one column per module, driven entirely by
 * common/lessons.json. Adding a lesson to the registry makes it appear here.
 */
const columns = computed(() =>
  MODULES.map(module => ({ module, lessons: lessonsOfModule(module.id) }))
)
</script>

<template>
  <div class="lesson-grid">
    <div v-for="column in columns" :key="column.module.id" class="lesson-column">
      <div class="lesson-column-head">
        <span class="lesson-column-emoji">{{ column.module.emoji }}</span>
        <span class="lesson-column-title">{{ column.module.title }}</span>
      </div>
      <LessonCard v-for="lesson in column.lessons" :key="lesson.slug" :slug="lesson.slug" />
    </div>
  </div>
</template>

<style scoped>
.lesson-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: start;
  text-align: left;
}

.lesson-column {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
}

.lesson-column-head {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  padding-bottom: 0.25rem;
  margin-bottom: 0.1rem;
  border-bottom: 1px solid rgba(120, 113, 108, 0.25);
}

.lesson-column-emoji {
  font-size: 0.9rem;
}

.lesson-column-title {
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.8;
}
</style>
