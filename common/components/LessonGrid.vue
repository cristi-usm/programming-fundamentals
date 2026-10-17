<script setup lang="ts">
import { computed } from 'vue'
import { MODULES, isPublished, lessonsOfModule } from '../lessons'
import LessonCard from './LessonCard.vue'

/**
 * The hub's table of contents: one column per module, driven entirely by
 * common/lessons.json. Adding a lesson to the registry makes it appear here.
 *
 * A module whose lessons are all still locked shows its name, like the locked
 * cards show theirs: students see the whole semester's subjects from the first
 * day. The heading is only drawn dashed and dimmed until the module starts.
 */
const columns = computed(() =>
  MODULES.map(module => {
    const lessons = lessonsOfModule(module.id)
    return { module, lessons, revealed: lessons.some(isPublished) }
  })
)
</script>

<template>
  <div class="lesson-grid">
    <div v-for="column in columns" :key="column.module.id" class="lesson-column">
      <div class="lesson-column-head" :class="{ unrevealed: !column.revealed }">
        <span class="lesson-column-icon" :class="column.module.icon" />
        <span class="lesson-column-title">{{ column.module.title }}</span>
      </div>
      <LessonCard v-for="lesson in column.lessons" :key="lesson.slug" :slug="lesson.slug" />
    </div>
  </div>
</template>

<style scoped>
.lesson-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
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
  border-bottom: 1px solid var(--neversink-admon-border-color);
}

.lesson-column-icon {
  width: 0.9rem;
  height: 0.9rem;
  flex: none;
  align-self: center;
  color: var(--neversink-highlight-color);
}

.lesson-column-title {
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.8;
}

/* A module that has not started yet: named, but drawn as not open yet. */
.lesson-column-head.unrevealed {
  border-bottom-style: dashed;
}

.lesson-column-head.unrevealed .lesson-column-icon,
.lesson-column-head.unrevealed .lesson-column-title {
  opacity: 0.7;
}
</style>
