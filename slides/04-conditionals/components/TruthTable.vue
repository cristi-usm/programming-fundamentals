<script setup lang="ts">
/**
 * What `&&`, `||` and `!` produce, for every combination.
 *
 * Written as numbers rather than as "true"/"false", because that is what C
 * actually computes: the operands are integers and the result is an `int`, 1
 * or 0. A table with the words in it would teach the wrong thing on a slide
 * whose whole point is that there is no boolean here.
 *
 * `shortCircuit` dims the second operand on the rows where it is never read.
 * That is not a footnote about efficiency: it is the reason
 * `x != 0 && 10 / x > 2` does not divide by zero, and students meet that
 * pattern in the first laboratory that has input validation in it.
 *
 * Static on purpose: it is a table, not a process.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Which operator the table is for. */
    op?: '&&' | '||' | '!'
    /** Name of the left operand. */
    a?: string
    /** Name of the right operand. Ignored by `!`. */
    b?: string
    /** Dim the operand that is never evaluated, and say so. */
    shortCircuit?: boolean
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  { op: '&&', a: 'a', b: 'b', shortCircuit: false, color: 'blue-light' },
)

const unary = computed(() => props.op === '!')

interface Row { a: 0 | 1, b?: 0 | 1, out: 0 | 1, skipped: boolean }

const rows = computed<Row[]>(() => {
  if (unary.value)
    return ([0, 1] as const).map(a => ({ a, out: (a ? 0 : 1) as 0 | 1, skipped: false }))

  const pairs = [[0, 0], [0, 1], [1, 0], [1, 1]] as const
  return pairs.map(([a, b]) => ({
    a,
    b,
    out: (props.op === '&&' ? (a && b ? 1 : 0) : (a || b ? 1 : 0)) as 0 | 1,
    // `&&` stops at a zero on the left, `||` stops at a non-zero on the left.
    skipped: props.op === '&&' ? a === 0 : a === 1,
  }))
})

/** The Romanian name, so the symbol is not the only handle students have on it. */
const name = computed(() =>
  props.op === '&&' ? 'ȘI' : props.op === '||' ? 'SAU' : 'NEGARE')

const rule = computed(() =>
  props.op === '&&'
    ? 'Dă 1 doar când amândouă sunt ≠ 0.'
    : props.op === '||'
      ? 'Dă 1 când măcar una este ≠ 0.'
      : 'Întoarce pe dos: 0 devine 1, orice altceva devine 0.')
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-tt']">
    <div class="ns-tt__op">{{ op }}</div>
    <div class="ns-tt__name">{{ name }}</div>

    <table class="ns-tt__table">
      <thead>
        <tr>
          <th>{{ a }}</th>
          <th v-if="!unary">{{ b }}</th>
          <th class="ns-tt__out-col">
            {{ unary ? `!${a}` : `${a} ${op} ${b}` }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="i">
          <td>{{ r.a }}</td>
          <td v-if="!unary" :class="{ 'is-skipped': shortCircuit && r.skipped }">
            <template v-if="shortCircuit && r.skipped">
              <span class="ns-tt__never">nu se citește</span>
            </template>
            <template v-else>{{ r.b }}</template>
          </td>
          <td class="ns-tt__out" :class="`is-${r.out}`">{{ r.out }}</td>
        </tr>
      </tbody>
    </table>

    <p class="ns-tt__rule">{{ rule }}</p>
  </div>
</template>

<style scoped>
.ns-tt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
  color: var(--neversink-text-color);
}

.ns-tt__op {
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--neversink-fg-color);
}

.ns-tt__name {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--neversink-text-color);
  opacity: 0.75;
  margin-top: -0.15rem;
  margin-bottom: 0.35rem;
}

.ns-tt__table {
  border-collapse: collapse;
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 1rem;
}

.ns-tt__table th,
.ns-tt__table td {
  min-width: 3.4rem;
  padding: 0.28rem 0.7rem;
  border: 1px solid var(--neversink-admon-border-color);
  text-align: center;
}

.ns-tt__table th {
  background: var(--neversink-admon-bg-color);
  font-size: 0.85rem;
  color: var(--neversink-fg-color);
}

.ns-tt__out-col {
  border-left-width: 2px;
}

.ns-tt__out {
  border-left-width: 2px;
  font-weight: 700;
}

.ns-tt__out.is-1 {
  color: var(--neversink-fg-color);
  background: var(--neversink-admon-bg-color);
}

.ns-tt__out.is-0 {
  opacity: 0.5;
}

/* The operand the program never looks at. */
.is-skipped {
  background: repeating-linear-gradient(
    -45deg,
    transparent 0 4px,
    var(--neversink-admon-bg-color) 4px 8px
  );
}

.ns-tt__never {
  font-family: var(--slidev-theme-font, sans-serif);
  font-size: 0.6rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.65;
}

.ns-tt__rule {
  margin: auto 0 0;
  max-width: 16rem;
  font-family: var(--slidev-theme-font, sans-serif);
  font-size: 0.8rem;
  text-align: center;
  opacity: 0.85;
}
</style>
