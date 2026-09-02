<script setup lang="ts">
/**
 * A horizontal pipeline: labelled nodes joined by animated arrows.
 *
 * Reused wherever a transformation is drawn — text → compiler → executabil,
 * sursă → preprocessor → … → linker, input → program → output.
 *
 *   <FlowSteps :steps="[
 *     { label: 'hello.c', sub: 'text scris de om', kind: 'file' },
 *     { label: 'compiler (gcc)', kind: 'stage', emphasis: true },
 *     { label: 'hello', sub: 'cod mașină', kind: 'file', highlight: true },
 *   ]" />
 *
 * Kinds: `stage` (a process, rounded box) and `file` (an artifact, mono text
 * with a document tab). `note` hangs a small caption under one node — e.g.
 * "+ biblioteci" under the linker.
 */
export interface FlowStep {
  label: string
  /** Small caption above the node — who or what this is. */
  sub?: string
  /** Small caption below the node — extra input/detail. */
  note?: string
  /** 'stage' = a process box; 'file' = an artifact (monospace, document tab). */
  kind?: 'stage' | 'file'
  /** Action written ON the arrow leading into this node ("Preprocessing"). */
  via?: string
  /** Small caption under that arrow ("+ biblioteci"). */
  viaNote?: string
  /** The step the slide is about: filled, accent border. */
  emphasis?: boolean
  /** The result worth noticing: accent text. */
  highlight?: boolean
}

withDefaults(
  defineProps<{
    steps: FlowStep[]
    /** Caption under the whole flow. */
    caption?: string
    /** Base font size of node labels, rem. Shrink for long pipelines. */
    size?: number
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  { caption: '', size: 1, color: 'blue-light' },
)
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-flow']" :style="{ '--ns-flow-size': `${size}rem` }">
    <div class="ns-flow__track">
      <template v-for="(step, i) in steps" :key="i">
        <div v-if="i > 0" class="ns-flow__arrow" :style="{ animationDelay: `${i * 0.12}s` }">
          <span v-if="step.via" class="ns-flow__via">{{ step.via }}</span>
          <div class="ns-flow__arrow-line">
            <span class="ns-flow__dash" />
            <span class="ns-flow__head" />
          </div>
          <span v-if="step.viaNote" class="ns-flow__via-note">{{ step.viaNote }}</span>
        </div>
        <div class="ns-flow__step" :style="{ animationDelay: `${i * 0.12}s` }">
          <div class="ns-flow__sub">{{ step.sub || ' ' }}</div>
          <div :class="['ns-flow__node',
                        `ns-flow__node--${step.kind || 'stage'}`,
                        { 'ns-flow__node--emphasis': step.emphasis,
                          'ns-flow__node--highlight': step.highlight }]">
            {{ step.label }}
          </div>
          <div class="ns-flow__note">{{ step.note || ' ' }}</div>
        </div>
      </template>
    </div>
    <div v-if="caption" class="ns-flow__caption">{{ caption }}</div>
  </div>
</template>

<style scoped>
.ns-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.ns-flow__track {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.15rem;
}

.ns-flow__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ns-flow-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ns-flow__sub,
.ns-flow__note {
  font-size: calc(var(--ns-flow-size) * 0.68);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.6;
  color: var(--neversink-text-color);
  min-height: 1.3em;
  line-height: 1.3;
  white-space: nowrap;
}

.ns-flow__sub { margin-bottom: 0.3rem; }
.ns-flow__note { margin-top: 0.3rem; text-transform: none; letter-spacing: 0.02em; }

.ns-flow__node {
  padding: 0.55em 0.95em;
  font-size: var(--ns-flow-size);
  border: 1.5px solid var(--neversink-admon-border-color);
  background: #fff;
  color: inherit;
  text-align: center;
  white-space: nowrap;
  line-height: 1.25;
  box-shadow: 0 6px 16px -12px #000;
}

/* A process: rounded box. */
.ns-flow__node--stage {
  border-radius: 10px;
  font-weight: 600;
}

/* An artifact: a document — square-ish, mono, folded corner. */
.ns-flow__node--file {
  border-radius: 3px 10px 3px 3px;
  font-family: monospace;
  background:
    linear-gradient(225deg, var(--neversink-admon-bg-color) 0.55em, transparent 0.55em),
    #fff;
}

.ns-flow__node--emphasis {
  border-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
  color: var(--neversink-text-color);
  font-weight: 700;
  box-shadow: 0 10px 22px -14px var(--neversink-fg-color);
}

.ns-flow__node--highlight {
  border-color: var(--neversink-border-color);
  color: var(--neversink-text-color);
  font-weight: 700;
}

/* The arrow: a dashed line whose dashes drift toward the head. When it carries
   a `via` label, the action sits in a pill riding on the line. */
.ns-flow__arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-width: 1.3rem;
  padding: 0 0.1rem;
  animation: ns-flow-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ns-flow__arrow-line {
  display: flex;
  align-items: center;
  width: 100%;
}

.ns-flow__via {
  padding: 0.2em 0.8em;
  margin-bottom: 0.35rem;
  border-radius: 999px;
  border: 1.5px solid var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
  color: var(--neversink-text-color);
  font-size: calc(var(--ns-flow-size) * 0.82);
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 6px 14px -10px var(--neversink-fg-color);
}

.ns-flow__via-note {
  margin-top: 0.3rem;
  font-size: calc(var(--ns-flow-size) * 0.68);
  font-weight: 600;
  opacity: 0.6;
  color: var(--neversink-text-color);
  white-space: nowrap;
}

.ns-flow__dash {
  display: block;
  width: 100%;
  min-width: 1rem;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    var(--neversink-border-color) 0 6px,
    transparent 6px 11px
  );
  background-size: 11px 2px;
  opacity: 0.7;
  animation: ns-flow-drift 0.9s linear infinite;
}

.ns-flow__head {
  display: block;
  width: 0.5em;
  height: 0.5em;
  margin-left: -0.32em;
  border-top: 2px solid var(--neversink-border-color);
  border-right: 2px solid var(--neversink-border-color);
  transform: rotate(45deg);
  opacity: 0.8;
}

.ns-flow__caption {
  margin-top: 0.8rem;
  font-size: 0.85rem;
  opacity: 0.75;
}

@keyframes ns-flow-drift {
  to { background-position: 11px 0; }
}

@keyframes ns-flow-rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
