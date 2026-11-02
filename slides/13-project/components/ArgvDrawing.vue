<script setup lang="ts">
/**
 * `argv` as it sits in memory: an array of pointers on the left, each one
 * pointing at its own '\0'-terminated string, and a NULL after the last.
 *
 *   argv[0] ─→ [.][/][c][a][t][a][l][o][g][\0]
 *   argv[1] ─→ [a][d][a][u][g][a][\0]
 *   argv[2] ─→ [A][n][a][␣][P][o][p][e][s][c][u][\0]
 *   argv[3] ─→ [9][\0]
 *   argv[4]    NULL
 *
 *   <ArgvDrawing :args="['./catalog', 'adauga', 'Ana Popescu', '9']" />
 *
 * Spaces are drawn as ␣ so a name with a space reads as ONE argument.
 * `highlight` tints one row (its index), e.g. the argument a slide is about.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    args: string[]
    highlight?: number
  }>(),
  { highlight: -1 },
)

const NUL = '\\0'

const rows = computed(() =>
  props.args.map((a) => [...a].map((ch) => (ch === ' ' ? '␣' : ch)).concat(NUL)),
)
</script>

<template>
  <div class="fp-argv">
    <div class="fp-argv__grid">
      <template v-for="(chars, i) in rows" :key="i">
        <div class="fp-argv__slot" :class="{ 'is-first': i === 0, 'is-hl': i === highlight }">
          argv[{{ i }}]
        </div>
        <div class="fp-argv__arrow">→</div>
        <div class="fp-argv__str">
          <span
            v-for="(ch, j) in chars"
            :key="j"
            class="fp-argv__ch"
            :class="{ 'is-nul': j === chars.length - 1, 'is-hl': i === highlight }"
          >{{ ch }}</span>
        </div>
      </template>
      <div class="fp-argv__slot is-last">argv[{{ rows.length }}]</div>
      <div class="fp-argv__arrow" />
      <div class="fp-argv__null">NULL</div>
    </div>
    <div class="fp-argv__caption">argc = {{ args.length }}</div>
  </div>
</template>

<style scoped>
.fp-argv {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fp-argv__grid {
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: center;
  row-gap: 0;
  column-gap: 0.6rem;
}

.fp-argv__slot {
  padding: 0 1rem;
  height: 2.6rem;
  line-height: 2.6rem;
  border: 1.5px solid var(--neversink-border-color);
  border-bottom: none;
  background: var(--neversink-admon-bg-color);
  font-family: monospace;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--neversink-fg-color);
}

.fp-argv__slot.is-first { border-radius: 10px 10px 0 0; }

.fp-argv__slot.is-last {
  border-bottom: 1.5px solid var(--neversink-border-color);
  border-radius: 0 0 10px 10px;
  background: color-mix(in srgb, var(--neversink-admon-bg-color) 30%, #fff);
}

.fp-argv__slot.is-hl { background: var(--neversink-border-color); color: #fff; }

.fp-argv__arrow {
  font-size: 1.3rem;
  opacity: 0.6;
}

.fp-argv__str { display: flex; }

.fp-argv__ch {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  border: 1.5px solid var(--neversink-admon-border-color);
  margin-left: -1.5px;
  background: color-mix(in srgb, var(--neversink-admon-bg-color) 30%, #fff);
  font-family: monospace;
  font-size: 1rem;
}

.fp-argv__ch.is-hl { background: var(--neversink-admon-bg-color); font-weight: 700; }

.fp-argv__ch.is-nul { opacity: 0.55; font-size: 0.8rem; }

.fp-argv__null {
  font-family: monospace;
  font-size: 1rem;
  opacity: 0.6;
}

.fp-argv__caption {
  margin-top: 0.9rem;
  font-family: monospace;
  font-size: 0.95rem;
  opacity: 0.75;
}
</style>
