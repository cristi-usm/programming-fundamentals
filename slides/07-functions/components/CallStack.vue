<script setup lang="ts">
/**
 * The call stack at one moment: one box per active call, the newest on top.
 *
 *        ┌──────────────┐
 *        │ patrat       │  ← the call that is running now (tinted)
 *        │ x = 2        │
 *        ├──────────────┤
 *        │ sumaPatrate  │
 *        │ a = 2  b = 3 │
 *        ├──────────────┤
 *        │ main         │
 *        │ r = ?        │
 *        └══════════════┘  ← the bottom of the stack
 *
 *   <CallStack :frames="[
 *     { name: 'patrat', vars: 'x = 2' },
 *     { name: 'sumaPatrate', vars: 'a = 2   b = 3' },
 *     { name: 'main', vars: 'r = ?' },
 *   ]" />
 *
 * Frames are listed TOP FIRST, the way the stack is read. `note` is a second,
 * fainter line for what the frame is waiting on ("asteapta 3 * factorial(2)").
 * `compact` shrinks everything for several stacks side by side.
 */
type Frame = { name: string; vars?: string; note?: string }

withDefaults(
  defineProps<{
    frames: Frame[]
    compact?: boolean
  }>(),
  { compact: false },
)
</script>

<template>
  <div class="fp-callstack" :class="{ 'is-compact': compact }">
    <div
      v-for="(f, i) in frames"
      :key="i"
      class="fp-callstack__frame"
      :class="{ 'is-top': i === 0 }"
    >
      <div class="fp-callstack__name">{{ f.name }}</div>
      <div v-if="f.vars" class="fp-callstack__vars">{{ f.vars }}</div>
      <div v-if="f.note" class="fp-callstack__note">{{ f.note }}</div>
    </div>
    <div class="fp-callstack__floor" />
  </div>
</template>

<style scoped>
.fp-callstack {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 13rem;
  margin: 0 auto;
}

.fp-callstack__frame {
  padding: 0.45rem 0.8rem;
  border: 1.5px solid var(--neversink-admon-border-color);
  border-bottom: none;
  background: color-mix(in srgb, var(--neversink-admon-bg-color) 30%, #fff);
  font-family: monospace;
}

.fp-callstack__frame:first-child { border-radius: 10px 10px 0 0; }

.fp-callstack__frame.is-top {
  background: var(--neversink-admon-bg-color);
  border-color: var(--neversink-border-color);
  border-width: 2px;
  border-bottom: none;
}

.fp-callstack__name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--neversink-text-color);
}

.fp-callstack__vars { font-size: 0.95rem; }

.fp-callstack__note {
  margin-top: 0.1rem;
  font-size: 0.75rem;
  opacity: 0.65;
}

/* The bottom of the stack: main always sits on it. */
.fp-callstack__floor {
  height: 6px;
  border-radius: 0 0 4px 4px;
  background: var(--neversink-border-color);
}

.is-compact { width: 9.5rem; }
.is-compact .fp-callstack__frame { padding: 0.3rem 0.55rem; }
.is-compact .fp-callstack__name { font-size: 0.8rem; }
.is-compact .fp-callstack__vars { font-size: 0.75rem; }
.is-compact .fp-callstack__note { font-size: 0.65rem; }
</style>
