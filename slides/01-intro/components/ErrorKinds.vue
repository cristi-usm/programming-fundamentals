<script setup lang="ts">
/**
 * The four kinds of errors as a 2×2 grid of cards. Each card names the error,
 * says where it is caught, and carries a verdict. The icon set is Lucide via
 * UnoCSS (`i-lucide-*`) — drawn icons, one consistent stroke, never emoji.
 *
 * Specific to lesson 1's "Patru Feluri de a Greși" slide.
 */
const kinds = [
  {
    icon: 'i-lucide-spell-check-2',
    name: 'Eroare de sintaxă',
    caught: 'prinsă la compilare',
    text: 'Ați uitat un ; sau o acoladă. Compilatorul refuză să traducă și vă arată exact linia.',
    verdict: 'evidentă',
    level: 1,
  },
  {
    icon: 'i-lucide-puzzle',
    name: 'Semantică statică',
    caught: 'prinsă la compilare',
    text: 'Gramatical corect, dar fără sens ca tipuri: adunați un text cu un număr.',
    verdict: 'ușor de observat',
    level: 2,
  },
  {
    icon: 'i-lucide-zap',
    name: 'Eroare la runtime',
    caught: 'apare la rulare',
    text: 'Compilează și pornește, dar se oprește în timpul execuției: împărțire la zero, segmentation fault.',
    verdict: 'se vede la rulare',
    level: 3,
  },
  {
    icon: 'i-lucide-eye-off',
    name: 'Rezultat greșit',
    caught: 'nu o prinde nimeni',
    text: 'Rulează, se termină normal, și afișează un rezultat greșit. Nimic nu vă avertizează.',
    verdict: 'greu de observat',
    level: 4,
  },
]
</script>

<template>
  <div class="neversink-blue-light-scheme ns-errk">
    <div v-for="(k, i) in kinds" :key="k.name"
      :class="['ns-errk__card', { 'ns-errk__card--danger': k.level === 4 }]"
      :style="{ animationDelay: `${i * 0.12}s` }">
      <div class="ns-errk__head">
        <span :class="['ns-errk__icon', k.icon]" />
        <div>
          <div class="ns-errk__name">{{ k.name }}</div>
          <div class="ns-errk__caught">{{ k.caught }}</div>
        </div>
        <span class="ns-errk__verdict">{{ k.verdict }}</span>
      </div>
      <div class="ns-errk__text">{{ k.text }}</div>
    </div>
  </div>
</template>

<style scoped>
.ns-errk {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
  width: 100%;
}

.ns-errk__card {
  padding: 0.85rem 1rem;
  border: 1.5px solid var(--neversink-admon-border-color);
  border-radius: 12px;
  background: #fff;
  text-align: left;
  box-shadow: 0 10px 22px -18px #000;
  animation: ns-errk-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* The silent one is the villain of the slide — it alone gets the tinted fill. */
.ns-errk__card--danger {
  border-color: var(--neversink-border-color);
  background: var(--neversink-admon-bg-color);
}

.ns-errk__head {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.ns-errk__icon {
  flex: none;
  width: 1.7rem;
  height: 1.7rem;
  color: var(--neversink-text-color);
  opacity: 0.9;
}

.ns-errk__name {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25;
  color: var(--neversink-text-color);
}

.ns-errk__caught {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  opacity: 0.6;
}

.ns-errk__verdict {
  margin-left: auto;
  align-self: flex-start;
  padding: 0.18em 0.7em;
  border: 1px solid var(--neversink-admon-border-color);
  border-radius: 999px;
  background: #fff;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--neversink-text-color);
  opacity: 0.85;
  white-space: nowrap;
}

.ns-errk__text {
  margin-top: 0.5rem;
  font-size: 0.86rem;
  line-height: 1.5;
}

@keyframes ns-errk-rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
