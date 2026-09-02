<script setup lang="ts">
/**
 * A definition card: an eyebrow with the term and its source, then the text.
 *
 * Two weights. The default is a quiet, white card for a quoted definition — the
 * accent is spent on the rail and the eyebrow, the text itself stays near-black
 * so it reads at the back of the room. `emphasis` fills the card with the scheme
 * tint and enlarges the text: that is the version students keep.
 *
 *   <Definition term="Programare" source="DEX">
 *   Alcătuire a unei succesiuni de instrucțiuni…
 *   </Definition>
 *
 *   <Definition term="Programare" source="Pe scurt" emphasis>
 *   A face computerul să execute exact ce vrem noi — fără greșeli.
 *   </Definition>
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** The word being defined. Shown as an eyebrow above the text. */
    term?: string
    /** Where it comes from — `DEX`, `Standardul C`, `Pe scurt`… */
    source?: string
    /** The version to remember: tinted fill, larger type. */
    emphasis?: boolean
    /** Neversink colour scheme for the accents. Defaults to the deck's. */
    color?: string
  }>(),
  { term: '', source: '', emphasis: false, color: 'blue-light' },
)

const classes = computed(() => [
  `neversink-${props.color}-scheme`,
  'ns-definition',
  { 'ns-definition--emphasis': props.emphasis },
])
</script>

<template>
  <figure :class="classes">
    <figcaption v-if="term || source" class="ns-definition__eyebrow">
      <span v-if="term" class="ns-definition__term">{{ term }}</span>
      <span v-if="term && source" class="ns-definition__sep" aria-hidden="true" />
      <span v-if="source" class="ns-definition__source">{{ source }}</span>
    </figcaption>
    <div class="ns-definition__body">
      <slot />
    </div>
  </figure>
</template>

<style scoped>
.ns-definition {
  /* A white card with one saturated rail: the accent marks the card as a
     definition, while the text keeps full contrast instead of going blue on
     blue. The rail is a pseudo-element so the radius stays even on all corners. */
  position: relative;
  margin: 0;
  padding: 1.75rem 2rem 1.75rem 2.5rem;
  border: 1px solid var(--neversink-admon-border-color);
  border-radius: 0.75rem;
  background: #fff;
  text-align: left;
  overflow: hidden;
}

.ns-definition::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 8px;
  background: var(--neversink-border-color);
}

.ns-definition__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.9rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--neversink-text-color);
}

/* A hairline between term and source, so the two read as one quiet line
   rather than two competing labels. */
.ns-definition__sep {
  flex: 1;
  height: 1px;
  background: var(--neversink-admon-border-color);
}

.ns-definition__source {
  font-weight: 600;
  letter-spacing: 0.1em;
  opacity: 0.7;
}

.ns-definition__body {
  font-size: 1.35rem;
  line-height: 1.6;
  /* No colour: inherit the slide's near-black body text. */
}

/* Markdown inside the slot: kill the outer margins so the card stays tight. */
.ns-definition__body :deep(p) {
  margin: 0;
}

.ns-definition__body :deep(p + p) {
  margin-top: 0.7rem;
}

.ns-definition__body :deep(strong) {
  color: var(--neversink-fg-color);
}

/* <mark> as a marker pen: a tint band over the lower half of the line plus an
   accent underline. The text keeps its own colour, so the word stays as
   readable as the rest of the sentence — the highlight points at it, it does
   not recolour it. box-decoration-break keeps the band intact when the phrase
   wraps across two lines. */
.ns-definition__body :deep(mark) {
  background: linear-gradient(
    to top,
    var(--neversink-admon-bg-color) 0.72em,
    transparent 0.72em
  );
  box-shadow: inset 0 -2px 0 var(--neversink-border-color);
  color: inherit;
  font-weight: 700;
  padding: 0 0.15em;
  border-radius: 2px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

/* A dictionary entry with several senses is a list. Markers are drawn in the
   accent colour so they tie back to the rail without tinting the text. */
.ns-definition__body :deep(ul) {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ns-definition__body :deep(li) {
  position: relative;
  padding-left: 1.5rem;
}

.ns-definition__body :deep(li + li) {
  margin-top: 0.7rem;
}

.ns-definition__body :deep(li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--neversink-border-color);
}

.ns-definition--emphasis {
  padding: 2.25rem 2.5rem 2.25rem 3rem;
  border-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
  box-shadow: 0 18px 40px -28px var(--neversink-fg-color);
}

.ns-definition--emphasis::before {
  width: 12px;
}

.ns-definition--emphasis .ns-definition__body {
  font-size: 1.9rem;
  line-height: 1.45;
  font-weight: 600;
  color: var(--neversink-fg-color);
}
</style>
