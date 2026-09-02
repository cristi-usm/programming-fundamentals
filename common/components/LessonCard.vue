<script setup lang="ts">
import { computed } from 'vue'
import { LESSONS, deckUrl, isPublished, lessonBySlug } from '../lessons'
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

/**
 * Only released decks are links. The rest stay on the grid — students see the
 * whole semester — but locked, so the card cannot be opened ahead of time.
 */
const open = computed(() => !props.disabled && isPublished(lesson.value))

const href = computed(() => (open.value && props.slug ? deckUrl(props.slug) : undefined))

/**
 * An unreleased lab gives nothing away — a neutral icon and its number, no
 * subject and no description. The grid shows how many labs there are and how
 * far we've got, not what is coming.
 */
const icon = computed(() => {
  if (props.icon) return props.icon
  if (!open.value) return 'i-ph-circle-dashed-duotone'
  return lesson.value?.icon ?? 'i-ph-question-duotone'
})

/**
 * A locked card shows nothing but skeleton bars — no subject, no description.
 * The grid says how many lessons there are and how far we've got, not what is
 * coming. `title` is therefore only ever read for an open card.
 */
const title = computed(() => {
  if (props.title) return props.title
  return lesson.value?.title ?? 'În curând'
})

const description = computed(() => {
  if (props.description) return props.description
  if (!open.value) return ''
  return lesson.value?.description ?? ''
})

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
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    class="lesson-card"
    :class="{ complete: isCompleted, current: isCurrent, locked: !href }"
    :aria-disabled="href ? undefined : 'true'"
  >
    <span v-if="open" class="lesson-card-icon" :class="icon" />
    <!-- The number is all a locked card gives away — it keeps the rows countable. -->
    <span v-else class="lesson-card-num">{{ lesson?.num ?? '·' }}</span>

    <div v-if="open" class="lesson-card-content">
      <h3>{{ title }}</h3>
      <!-- Kept even when empty, so a locked card is the same height as an open one. -->
      <p>{{ description }}</p>
    </div>
    <!-- Same box, same height — only the content is a placeholder. -->
    <div v-else class="lesson-card-content lesson-card-skeleton" aria-label="Se deschide mai târziu">
      <span class="skeleton-bar skeleton-title" />
      <span class="skeleton-bar skeleton-desc" />
    </div>
    <span v-if="isCompleted && open" class="lesson-card-status i-ph-check-circle-fill" />
    <span v-else-if="isCurrent && open" class="lesson-card-status i-ph-play-circle-fill" />
    <span
      v-else-if="!open"
      class="lesson-card-status lesson-card-lock i-ph-lock-simple-duotone"
      title="Se deschide la momentul potrivit"
    />
  </component>
</template>

<style scoped>
.lesson-card {
  display: flex;
  align-items: center;
  text-align: left;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: 1px solid var(--neversink-admon-border-color);
  border-radius: 8px;
  padding: 0.55rem 0.7rem;
  transition:
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.2s ease,
    border-color 0.2s ease;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.lesson-card:not(.locked) {
  cursor: pointer;
  border-color: var(--neversink-border-color);
}

.lesson-card:not(.locked):hover {
  background: var(--neversink-admon-bg-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px -6px rgba(15, 23, 42, 0.35);
}

.lesson-card:not(.locked):focus-visible {
  outline: 2px solid var(--neversink-highlight-color);
  outline-offset: 2px;
}

/* Locked cards still read as part of the semester — just not openable yet. */
.lesson-card.locked {
  background: color-mix(in srgb, var(--neversink-admon-bg-color) 30%, #fff);
  border-style: dashed;
  border-color: color-mix(in srgb, var(--neversink-admon-border-color) 70%, transparent);
  cursor: default;
}

.lesson-card-num {
  width: 1.25rem;
  margin-right: 0.6rem;
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: center;
  opacity: 0.35;
}

/* Placeholder bars stand in for the title and the description. */
.lesson-card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.12rem 0;
}

.skeleton-bar {
  display: block;
  height: 0.5rem;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--neversink-highlight-color) 12%, transparent) 0%,
    color-mix(in srgb, var(--neversink-highlight-color) 26%, transparent) 50%,
    color-mix(in srgb, var(--neversink-highlight-color) 12%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-sweep 2.4s ease-in-out infinite;
}

.skeleton-title {
  width: 78%;
}

.skeleton-desc {
  width: 52%;
  height: 0.4rem;
  opacity: 0.7;
}

/* Stagger the columns a little so the grid breathes instead of pulsing as one block. */
.lesson-card:nth-child(even) .skeleton-bar {
  animation-delay: 0.6s;
}

.lesson-card:nth-child(3n) .skeleton-bar {
  animation-delay: 1.1s;
}

@keyframes skeleton-sweep {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -20% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-bar {
    animation: none;
  }
}

.lesson-card.complete {
  border-color: rgba(74, 222, 128, 0.5);
  background: rgba(74, 222, 128, 0.05);
}

.lesson-card.complete:not(.locked):hover {
  background: rgba(74, 222, 128, 0.12);
  border-color: rgba(74, 222, 128, 0.7);
}

.lesson-card.current {
  border-color: rgba(251, 191, 36, 0.7);
  background: rgba(251, 191, 36, 0.08);
}

.lesson-card-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.6rem;
  flex-shrink: 0;
  color: var(--lesson-accent, var(--neversink-highlight-color));
}

.lesson-card-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.lesson-card h3 {
  color: var(--lesson-accent);
  margin-bottom: 0.1rem;
  font-size: 0.82rem;
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
  font-size: 0.68rem;
  line-height: 1.25;
  min-height: 0.85rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lesson-card-status {
  margin-left: 0.5rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: var(--neversink-highlight-color);
}

.lesson-card.complete .lesson-card-status {
  color: #4ade80;
}

.lesson-card-lock {
  color: var(--neversink-text-color);
  opacity: 0.35;
}
</style>
