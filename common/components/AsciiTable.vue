<script setup lang="ts">
/**
 * The ASCII table as students expect to meet it: codes and characters in a grid.
 *
 * Rows are 16 wide and start at 32, which is not cosmetic. Laid out that way the
 * three named groups line up in a shape that teaches the arithmetic by itself:
 *
 *   - the digits are one short block of 10
 *   - 'A' (65) and 'a' (97) land in the SAME column, exactly two rows apart,
 *     because 32 is two rows of 16 — which is why 'a' - 'A' is 32
 *   - inside each block the letters are consecutive, so 'A' + 1 is 'B'
 *
 * Codes 0–31 are control characters with no glyph, so they are summarised in a
 * note rather than drawn as 32 empty boxes.
 *
 *   <AsciiTable :marks="[48, 65, 97]" />
 */
withDefaults(
  defineProps<{
    /** Codes to ring, e.g. the ones the slide talks about. */
    marks?: number[]
    /** First code shown. 32 is the first printable one. */
    from?: number
    /** Last code shown. 126 is the last printable one. */
    to?: number
    caption?: string
    color?: string
  }>(),
  { marks: () => [], from: 32, to: 126, caption: '', color: 'blue-light' },
)

const PER_ROW = 16

const rows = (from: number, to: number) => {
  const out: (number | null)[][] = []
  for (let start = from; start <= to; start += PER_ROW) {
    out.push(
      Array.from({ length: PER_ROW }, (_, i) => (start + i <= to ? start + i : null)),
    )
  }
  return out
}

/**
 * The three groups the course actually uses get their own tint. Colour is doing
 * real work here: it separates the runs at a glance, which is what makes the
 * 'A'/'a' column alignment two rows apart legible from the back of the room.
 */
const group = (c: number) => {
  if (c >= 48 && c <= 57) return 'dig'
  if (c >= 65 && c <= 90) return 'upp'
  if (c >= 97 && c <= 122) return 'low'
  return ''
}

const glyph = (c: number) => (c === 32 ? '␣' : String.fromCharCode(c))
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-at']">
    <div class="ns-at__grid">
      <template v-for="(row, r) in rows(from, to)" :key="r">
        <div
          v-for="(code, i) in row"
          :key="`${r}-${i}`"
          :class="[
            'ns-at__cell',
            code !== null && group(code) ? `ns-at__cell--${group(code)}` : '',
            { 'ns-at__cell--mark': code !== null && marks.includes(code) },
            { 'ns-at__cell--empty': code === null },
          ]"
        >
          <template v-if="code !== null">
            <span class="ns-at__char">{{ glyph(code) }}</span>
            <span class="ns-at__code">{{ code }}</span>
          </template>
        </div>
      </template>
    </div>

    <div class="ns-at__legend">
      <span class="ns-at__key ns-at__cell--dig">cifre</span>
      <span class="ns-at__key ns-at__cell--upp">majuscule</span>
      <span class="ns-at__key ns-at__cell--low">minuscule</span>
      <span class="ns-at__note">
        codurile <strong>0–31</strong> nu au simbol: sunt caractere de control
        precum Enter (10) și Tab (9)
      </span>
    </div>

    <div v-if="caption" class="ns-at__caption">{{ caption }}</div>
  </div>
</template>

<style scoped>
.ns-at {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--neversink-text-color);
}

.ns-at__grid {
  display: grid;
  grid-template-columns: repeat(16, minmax(0, 1fr));
  gap: 2px;
  width: 100%;
  max-width: 52rem;
}

.ns-at__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0;
  border: 1px solid var(--neversink-admon-border-color);
  border-radius: 5px;
  background: #fff;
  line-height: 1.05;
}

/* The tinted blocks are the whole point: their shape and alignment carry the
   arithmetic, so everything ungrouped stays deliberately plain. Three hues, not
   three shades of one: at a glance the runs must be told apart, not ranked. */
.ns-at__cell--dig {
  background: #fef3c7;
  border-color: #fcd34d;
}

.ns-at__cell--upp {
  background: #dbeafe;
  border-color: #93c5fd;
}

.ns-at__cell--low {
  background: #d1fae5;
  border-color: #6ee7b7;
}

.ns-at__cell--dig .ns-at__char { color: #b45309; }
.ns-at__cell--upp .ns-at__char { color: #1d4ed8; }
.ns-at__cell--low .ns-at__char { color: #047857; }

.ns-at__cell--mark {
  outline: 2px solid var(--neversink-fg-color);
  outline-offset: 1px;
  z-index: 1;
}

.ns-at__cell--empty {
  border: none;
  background: transparent;
}

.ns-at__char {
  font-family: monospace;
  font-size: 0.95rem;
  font-weight: 700;
}

.ns-at__code {
  font-family: monospace;
  font-size: 0.58rem;
  opacity: 0.55;
}

.ns-at__legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.7rem;
}

.ns-at__key {
  padding: 0.15em 0.7em;
  border: 1px solid;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.ns-at__note {
  font-size: 0.72rem;
  opacity: 0.65;
}

.ns-at__caption {
  margin-top: 0.35rem;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.75;
}
</style>
