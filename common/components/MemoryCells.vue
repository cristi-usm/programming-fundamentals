<script setup lang="ts">
/**
 * A strip of memory cells: address, content, and an optional name above.
 *
 * Reused wherever memory is drawn — a variable, an array, a string, a block
 * returned by `malloc`.
 *
 *   <MemoryCells :cells="[
 *     { addr: '0x7ffd04', value: '8', name: 'nota', highlight: true },
 *     { addr: '0x7ffd08', value: '?' },
 *   ]" />
 *
 * `value` is free text, so `?`, `\\0` or `garbage` are all fine. The strip sits
 * on a "RAM" board and fades out at both ends — memory continues beyond what
 * the slide shows, and the drawing says so.
 */
withDefaults(
  defineProps<{
    cells: { addr?: string; value?: string; name?: string; highlight?: boolean }[]
    /** Caption under the strip. */
    caption?: string
    /** Cell width in px. */
    size?: number
    /** Tag in the board's corner. */
    label?: string
    /** Faded half-cells at both ends — the strip is a window, not the whole. */
    continues?: boolean
    /** Neversink colour scheme. Defaults to the deck's. */
    color?: string
  }>(),
  { caption: '', size: 92, label: 'RAM', continues: true, color: 'blue-light' },
)
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-mem']">
    <div class="ns-mem__board">
      <span v-if="label" class="ns-mem__tag">{{ label }}</span>
      <div class="ns-mem__strip">
        <div v-if="continues" class="ns-mem__col ns-mem__col--ghost" :style="{ width: `${size * 0.55}px` }">
          <div class="ns-mem__name">&nbsp;</div>
          <div class="ns-mem__cell ns-mem__cell--ghost">⋯</div>
          <div class="ns-mem__addr">&nbsp;</div>
        </div>
        <div v-for="(cell, i) in cells" :key="i" class="ns-mem__col"
          :style="{ width: `${size}px`, animationDelay: `${i * 0.09}s` }">
          <div class="ns-mem__name">
            <template v-if="cell.name">{{ cell.name }}<span class="ns-mem__pointer" /></template>
            <template v-else>&nbsp;</template>
          </div>
          <div :class="['ns-mem__cell', { 'ns-mem__cell--highlight': cell.highlight }]">
            {{ cell.value ?? '' }}
          </div>
          <div class="ns-mem__addr">{{ cell.addr || ' ' }}</div>
        </div>
        <div v-if="continues" class="ns-mem__col ns-mem__col--ghost" :style="{ width: `${size * 0.55}px` }">
          <div class="ns-mem__name">&nbsp;</div>
          <div class="ns-mem__cell ns-mem__cell--ghost">⋯</div>
          <div class="ns-mem__addr">&nbsp;</div>
        </div>
      </div>
      <div class="ns-mem__legend">
        <span class="ns-mem__legend-item"><span class="ns-mem__swatch ns-mem__swatch--cell" /> conținut (1 byte)</span>
        <span class="ns-mem__legend-item"><span class="ns-mem__swatch ns-mem__swatch--addr" /> adresă — fixă</span>
      </div>
    </div>
    <div v-if="caption" class="ns-mem__caption">{{ caption }}</div>
  </div>
</template>

<style scoped>
.ns-mem {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* The board: the chip the cells live on. */
.ns-mem__board {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1.6rem 0.9rem;
  border: 1.5px solid var(--neversink-admon-border-color);
  border-radius: 16px;
  background: color-mix(in srgb, var(--neversink-admon-bg-color) 38%, #fff);
  box-shadow: 0 14px 30px -24px #000;
}

.ns-mem__tag {
  position: absolute;
  top: -0.7rem;
  left: 1.1rem;
  padding: 0.1em 0.75em;
  border-radius: 999px;
  background: var(--neversink-border-color);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.ns-mem__strip {
  display: flex;
  gap: 0.35rem;
  align-items: flex-end;
}

.ns-mem__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ns-mem-rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ns-mem__col--ghost {
  opacity: 0.45;
  animation: none;
}

/* The name sits above the box with a small pointer down to it — the box itself
   is the memory; the name is only what WE call that address. */
.ns-mem__name {
  position: relative;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: monospace;
  color: var(--neversink-text-color);
  margin-bottom: 0.45rem;
}

.ns-mem__pointer {
  position: absolute;
  left: 50%;
  top: calc(100% + 0.08rem);
  width: 0.45rem;
  height: 0.45rem;
  transform: translateX(-50%) rotate(45deg);
  border-right: 2px solid var(--neversink-border-color);
  border-bottom: 2px solid var(--neversink-border-color);
}

.ns-mem__cell {
  width: 100%;
  padding: 0.7rem 0.2rem;
  border: 2px solid var(--neversink-admon-border-color);
  border-radius: 8px;
  background: #fff;
  font-family: monospace;
  font-size: 1.2rem;
  text-align: center;
  box-shadow: inset 0 -3px 0 color-mix(in srgb, var(--neversink-admon-border-color) 45%, transparent);
}

.ns-mem__cell--ghost {
  border-style: dashed;
  background: transparent;
  box-shadow: none;
}

.ns-mem__cell--highlight {
  border-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
  color: var(--neversink-fg-color);
  font-weight: 700;
  box-shadow:
    inset 0 -3px 0 color-mix(in srgb, var(--neversink-border-color) 50%, transparent),
    0 8px 18px -12px var(--neversink-fg-color);
}

.ns-mem__addr {
  margin-top: 0.35rem;
  padding: 0.05em 0.55em;
  border: 1px solid var(--neversink-admon-border-color);
  border-radius: 999px;
  background: #fff;
  font-family: monospace;
  font-size: 0.7rem;
  opacity: 0.8;
}

.ns-mem__col--ghost .ns-mem__addr {
  border: none;
  background: transparent;
}

.ns-mem__legend {
  display: flex;
  gap: 1.4rem;
  margin-top: 0.8rem;
}

.ns-mem__legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  opacity: 0.7;
  color: var(--neversink-text-color);
}

.ns-mem__swatch {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 3px;
  border: 1.5px solid var(--neversink-admon-border-color);
  background: #fff;
}

.ns-mem__swatch--addr {
  border-radius: 999px;
  height: 0.55rem;
}

.ns-mem__caption {
  margin-top: 0.7rem;
  font-size: 0.85rem;
  opacity: 0.75;
}

@keyframes ns-mem-rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
