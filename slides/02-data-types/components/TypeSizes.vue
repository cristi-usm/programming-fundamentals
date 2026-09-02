<script setup lang="ts">
/**
 * The fundamental types drawn to scale: one square per byte, so `double` is
 * visibly eight times `char`. Sizes are the usual x86-64 ones — the slide says
 * "de obicei", and the sizeof slide right after lets students check.
 *
 * Specific to lesson 2.
 */
const types = [
  { name: 'char', bytes: 1, holds: 'un caracter (un cod ASCII)' },
  { name: 'short', bytes: 2, holds: 'întregi mici: −32.768 … 32.767' },
  { name: 'int', bytes: 4, holds: 'întregi: ±2,1 miliarde', highlight: true },
  { name: 'long', bytes: 8, holds: 'întregi foarte mari' },
  { name: 'float', bytes: 4, holds: 'reale, ~7 cifre precizie' },
  { name: 'double', bytes: 8, holds: 'reale, ~15 cifre precizie' },
]
</script>

<template>
  <div class="neversink-blue-light-scheme ns-tsz">
    <div v-for="(t, i) in types" :key="t.name" class="ns-tsz__row"
      :style="{ animationDelay: `${i * 0.09}s` }">
      <div :class="['ns-tsz__name', { 'ns-tsz__name--highlight': t.highlight }]">{{ t.name }}</div>
      <div class="ns-tsz__bytes">
        <span v-for="b in t.bytes" :key="b"
          :class="['ns-tsz__byte', { 'ns-tsz__byte--highlight': t.highlight }]" />
        <span class="ns-tsz__count">{{ t.bytes }} {{ t.bytes === 1 ? 'byte' : 'bytes' }}</span>
      </div>
      <div class="ns-tsz__holds">{{ t.holds }}</div>
    </div>
    <div class="ns-tsz__caption">un pătrat = un byte (o cutie de memorie) · mărimile uzuale pe un PC modern</div>
  </div>
</template>

<style scoped>
.ns-tsz {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  width: 100%;
}

.ns-tsz__row {
  display: grid;
  grid-template-columns: 6rem 17rem 1fr;
  align-items: center;
  gap: 1rem;
  animation: ns-tsz-rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ns-tsz__name {
  font-family: monospace;
  font-weight: 700;
  font-size: 1.05rem;
  text-align: right;
  color: var(--neversink-text-color);
}

.ns-tsz__name--highlight {
  font-size: 1.15rem;
}

.ns-tsz__bytes {
  display: flex;
  align-items: center;
  gap: 0.22rem;
}

.ns-tsz__byte {
  width: 1.55rem;
  height: 1.55rem;
  border: 2px solid var(--neversink-admon-border-color);
  border-radius: 5px;
  background: #fff;
  box-shadow: inset 0 -2px 0 color-mix(in srgb, var(--neversink-admon-border-color) 45%, transparent);
}

.ns-tsz__byte--highlight {
  border-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
}

.ns-tsz__count {
  margin-left: 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.6;
  white-space: nowrap;
}

.ns-tsz__holds {
  font-size: 0.85rem;
  opacity: 0.85;
  text-align: left;
}

.ns-tsz__caption {
  margin-top: 0.6rem;
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.7;
}

@keyframes ns-tsz-rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
