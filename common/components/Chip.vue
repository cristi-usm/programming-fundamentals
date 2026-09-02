<script setup lang="ts">
/**
 * A small pill for one item in a list — a language, a tool, a file extension.
 *
 * The icon is optional and resolved from `icon-registry.ts`: by the `icon` prop
 * when given, otherwise by the chip's own text. Anything not in the registry
 * renders as a plain pill, so chips can be used for things that have no logo.
 *
 *   <Chip>Python</Chip>
 *   <Chip icon="c" emphasis>C</Chip>
 *   <Chip :icon="false">MATLAB</Chip>
 */
import { computed, useSlots } from 'vue'
import { iconFor } from './icon-registry'

const props = withDefaults(
  defineProps<{
    /** Registry key. Defaults to the chip's text; `false` forces no icon. */
    icon?: string | false
    /** Filled instead of outlined — the one that matters on this slide. */
    emphasis?: boolean
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  { icon: undefined, emphasis: false, color: 'blue-light' },
)

const slots = useSlots()

/** The slot's plain text, so a chip can find its own logo. */
const slotText = computed(() => {
  const nodes = slots.default?.() ?? []
  return nodes
    .map((n) => (typeof n.children === 'string' ? n.children : ''))
    .join('')
    .trim()
})

const icon = computed(() =>
  props.icon === false ? undefined : iconFor(props.icon ?? slotText.value),
)
</script>

<template>
  <span
    :class="[`neversink-${color}-scheme`, 'ns-chip', { 'ns-chip--emphasis': emphasis }]"
  >
    <component :is="icon" v-if="icon" class="ns-chip__icon" />
    <span class="ns-chip__text"><slot /></span>
  </span>
</template>

<style scoped>
.ns-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.25em 0.7em;
  border: 1px solid var(--neversink-admon-border-color);
  border-radius: 999px;
  background: #fff;
  font-size: 0.9em;
  line-height: 1.5;
  white-space: nowrap;
  vertical-align: middle;
}

.ns-chip__icon {
  width: 1.1em;
  height: 1.1em;
  flex: none;
}

.ns-chip--emphasis {
  border-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
  font-weight: 700;
  color: var(--neversink-fg-color);
}
</style>
