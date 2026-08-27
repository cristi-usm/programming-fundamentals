<script setup lang="ts">
import { computed } from 'vue'
import { LESSONS, deckUrl, isDraft, lessonBySlug } from '../lessons'
import { THEME_CONFIG } from '../theme/config'

/**
 * A card on the hub grid. Everything but the slug comes from lessons.json, so
 * adding a lesson to the registry is enough to describe it here:
 *
 *   <LessonCard slug="05-arrays" />
 *
 * Pass `disabled` for a lesson whose deck does not exist yet.
 */
const props = defineProps<{
  slug?: string
  icon?: string
  title?: string
  description?: string
  disabled?: boolean
}>()

const lesson = computed(() => (props.slug ? lessonBySlug(props.slug) : undefined))

const icon = computed(() => props.icon ?? lesson.value?.icon ?? '❓')
const title = computed(() => props.title ?? lesson.value?.title ?? 'În curând')
const description = computed(() => props.description ?? lesson.value?.description ?? 'În curând')

/** A lesson is marked done once the active lesson has moved past it. */
const isCompleted = computed(() => {
  if (!props.slug || props.disabled) return false
  const order = LESSONS.map(l => l.slug)
  const current = order.indexOf(THEME_CONFIG.currentLesson)
  const mine = order.indexOf(props.slug)
  if (current === -1 || mine === -1) return false
  return mine < current
})

const isCurrent = computed(() => !props.disabled && props.slug === THEME_CONFIG.currentLesson)

/** Scaffolded but unwritten decks stay clickable — just visibly marked. */
const draft = computed(() => !!lesson.value && isDraft(lesson.value))

const href = computed(() => {
  if (!props.slug || props.disabled) return undefined
  return deckUrl(props.slug)
})
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    class="lesson-card"
    :class="{ complete: isCompleted, current: isCurrent, disabled: !href }"
  >
    <div class="lesson-card-icon">{{ icon }}</div>
    <div class="lesson-card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div v-if="isCompleted" class="lesson-card-status">✅</div>
    <div v-else-if="isCurrent" class="lesson-card-status">▶️</div>
    <span v-if="draft" class="lesson-card-draft" title="Deck-ul nu este încă scris">schelet</span>
  </component>
</template>

<style scoped>
.lesson-card {
  display: flex;
  align-items: center;
  text-align: left;
  text-decoration: none;
  color: inherit;
  background: rgba(120, 113, 108, 0.06);
  border: 1px solid rgba(120, 113, 108, 0.25);
  border-radius: 8px;
  padding: 0.7rem 1rem;
  transition: all 0.2s ease;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.lesson-card:not(.disabled) {
  cursor: pointer;
}

.lesson-card:not(.disabled):hover {
  background: rgba(120, 113, 108, 0.14);
  border-color: rgba(120, 113, 108, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.lesson-card.disabled {
  opacity: 0.45;
}

.lesson-card.complete {
  border-color: rgba(74, 222, 128, 0.5);
  background: rgba(74, 222, 128, 0.05);
}

.lesson-card.complete:hover {
  background: rgba(74, 222, 128, 0.12);
  border-color: rgba(74, 222, 128, 0.7);
}

.lesson-card.current {
  border-color: rgba(251, 191, 36, 0.7);
  background: rgba(251, 191, 36, 0.08);
}

.lesson-card-icon {
  font-size: 1.8rem;
  margin-right: 0.9rem;
  flex-shrink: 0;
  width: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lesson-card-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.lesson-card h3 {
  color: var(--lesson-accent);
  margin-bottom: 0.1rem;
  font-size: 1rem;
  line-height: 1.2;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lesson-card.complete h3 {
  color: #4ade80;
}

.lesson-card p {
  opacity: 0.85;
  font-size: 0.75rem;
  line-height: 1.25;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lesson-card-status {
  margin-left: 0.5rem;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.lesson-card-draft {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.55rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.05rem 0.35rem;
  border-radius: 0 8px 0 6px;
  background: rgba(245, 158, 11, 0.25);
  color: #b45309;
}
</style>
