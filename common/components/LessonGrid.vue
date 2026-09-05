<script setup lang="ts">
import { computed } from 'vue'
import { MODULES, isPublished, lessonsOfModule } from '../lessons'
import LessonCard from './LessonCard.vue'

/**
 * The hub's table of contents: one column per module, driven entirely by
 * common/lessons.json. Adding a lesson to the registry makes it appear here.
 *
 * A module whose lessons are all still locked keeps its column but not its
 * name: the heading becomes a placeholder bar, same rule as the cards. The
 * module titles would otherwise announce the whole semester's subjects on the
 * first day, which is exactly what the locked cards avoid.
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
        <span
          class="lesson-column-icon"
          :class="column.revealed ? column.module.icon : 'i-ph-circle-dashed-duotone'"
        />
        <span v-if="column.revealed" class="lesson-column-title">{{ column.module.title }}</span>
        <span v-else class="lesson-column-title-skeleton" :aria-label="`Modulul ${column.module.id}`" />
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

/* A module that has not started yet: the column is there, the name is not. */
.lesson-column-head.unrevealed {
  border-bottom-style: dashed;
}

.lesson-column-head.unrevealed .lesson-column-icon {
  opacity: 0.4;
}

.lesson-column-title-skeleton {
  display: block;
  width: 60%;
  height: 0.55rem;
  align-self: center;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--neversink-highlight-color) 14%, transparent) 0%,
    color-mix(in srgb, var(--neversink-highlight-color) 30%, transparent) 50%,
    color-mix(in srgb, var(--neversink-highlight-color) 14%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: column-sweep 2.4s linear infinite;
}

/* One full tile of travel (120% → -80% is a 200% shift), so the last frame is
   pixel-identical to the first and the loop has no seam. */
@keyframes column-sweep {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -80% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lesson-column-title-skeleton {
    animation: none;
  }
}
</style>
