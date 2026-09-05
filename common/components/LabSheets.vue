<script setup lang="ts">
import { computed } from 'vue'
import { LESSONS, isPublished } from '../lessons'

/**
 * The list of lab sheets (fișele de laborator), one row per lesson.
 *
 * Each row links to the PDF published on Moodle. The URL lives in
 * `common/lessons.json` as `sheet`; a lesson without one renders as a plain
 * row marked *în curând*, so the list is complete from day one and fills in as
 * the sheets go up.
 *
 * A lab that is not released yet shows only its number — same rule as
 * <LessonCard>: the list says how many labs there are, not what they are about.
 */
const sheets = computed(() =>
  LESSONS.map(lesson => ({
    num: lesson.num,
    sheet: lesson.sheet,
    // Registry titles read "Lecția 5: Cicluri" — the number is already the badge.
    title: isPublished(lesson)
      ? lesson.title.split(': ').slice(1).join(': ') || lesson.title
      : '',
  })),
)
</script>

<template>
  <ol class="lab-sheets">
    <li v-for="sheet in sheets" :key="sheet.num">
      <component
        :is="sheet.sheet ? 'a' : 'div'"
        :href="sheet.sheet"
        :target="sheet.sheet ? '_blank' : undefined"
        rel="noopener"
        class="lab-sheet"
        :class="{ pending: !sheet.sheet }"
      >
        <span class="lab-sheet-num">{{ sheet.num }}</span>
        <span v-if="sheet.sheet" class="lab-sheet-title">{{ sheet.title }}</span>
        <!-- A placeholder bar for an unreleased lab; the row still holds its place. -->
        <span v-else class="lab-sheet-title lab-sheet-bar" />
        <span v-if="sheet.sheet" class="lab-sheet-mark i-ph-file-pdf-duotone" />
        <span v-else class="lab-sheet-soon">în curând</span>
      </component>
    </li>
  </ol>
</template>

<style scoped>
.lab-sheets {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-flow: column;
  grid-template-rows: repeat(5, auto);
  gap: 0.35rem 1.2rem;
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.lab-sheet {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.3rem 0.15rem;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid var(--neversink-admon-border-color);
  transition: color 0.2s ease, border-color 0.2s ease;
}

a.lab-sheet:hover {
  color: var(--neversink-highlight-color);
  border-color: var(--neversink-highlight-color);
}

a.lab-sheet:focus-visible {
  outline: 2px solid var(--neversink-highlight-color);
  outline-offset: 2px;
}

.lab-sheet-num {
  flex: none;
  width: 1.35rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 0.75rem;
  text-align: right;
  opacity: 0.5;
}

.lab-sheet-title {
  flex: 1;
  min-width: 0;
  min-height: 1rem;
  font-size: 0.8rem;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lab-sheet-mark {
  flex: none;
  width: 1rem;
  height: 1rem;
  color: var(--neversink-highlight-color);
}

.lab-sheet-soon {
  flex: none;
  font-size: 0.6rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.45;
}

.lab-sheet.pending .lab-sheet-title {
  opacity: 0.6;
}

.lab-sheet-bar {
  height: 0.45rem;
  align-self: center;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--neversink-highlight-color) 12%, transparent) 0%,
    color-mix(in srgb, var(--neversink-highlight-color) 28%, transparent) 50%,
    color-mix(in srgb, var(--neversink-highlight-color) 12%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: sheet-sweep 2.4s linear infinite;
}

/* Offset the rows so the list ripples instead of blinking as one block. */
.lab-sheets li:nth-child(even) .lab-sheet-bar {
  animation-delay: 0.5s;
}

.lab-sheets li:nth-child(3n) .lab-sheet-bar {
  animation-delay: 1s;
}

/* One full tile of travel (120% → -80% is a 200% shift), so the last frame is
   pixel-identical to the first and the loop has no seam. */
@keyframes sheet-sweep {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -80% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lab-sheet-bar {
    animation: none;
  }
}
</style>
