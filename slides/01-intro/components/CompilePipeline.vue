<script setup lang="ts">
/**
 * The real build pipeline, drawn to be slightly overwhelming.
 *
 * This is NOT a slide that teaches the four stages — it exists so the class
 * sees that "compilarea" is a machine with many moving parts, of which they
 * have been shown a cartoon. So: no explanatory text, one continuous loop,
 * and deliberately more detail than anyone can absorb in one viewing —
 * headers feeding in at the top, every source file walking the same chain,
 * libraries joining at the link step.
 *
 * Pure CSS/SMIL, no clicks and no timers: it plays identically in the lesson
 * and in archived decks.
 */
withDefaults(defineProps<{ color?: string }>(), { color: 'blue-light' })
</script>

<template>
  <div :class="[`neversink-${color}-scheme`, 'ns-pipe']">
    <svg viewBox="0 0 960 340" role="img" aria-label="Lanțul de compilare">
      <defs>
        <marker id="pipe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--neversink-admon-border-color)" />
        </marker>

        <!-- routes the pulses travel; separate from the drawn wires -->
        <path id="pipe-a" d="M128 128 H854" />
        <path id="pipe-b" d="M128 228 H680 Q712 228 712 190 V150" />
        <path id="pipe-h" d="M254 44 V106" />
        <path id="pipe-l" d="M764 290 V152" />
      </defs>

      <!-- ── wires ───────────────────────────────────────────────────── -->
      <g class="ns-pipe__wire">
        <line x1="128" y1="128" x2="206" y2="128" marker-end="url(#pipe-arrow)" />
        <line x1="298" y1="128" x2="376" y2="128" marker-end="url(#pipe-arrow)" />
        <line x1="468" y1="128" x2="546" y2="128" marker-end="url(#pipe-arrow)" />
        <line x1="638" y1="128" x2="716" y2="128" marker-end="url(#pipe-arrow)" />
        <line x1="808" y1="128" x2="854" y2="128" marker-end="url(#pipe-arrow)" />

        <line x1="128" y1="228" x2="206" y2="228" marker-end="url(#pipe-arrow)" />
        <line x1="298" y1="228" x2="376" y2="228" marker-end="url(#pipe-arrow)" />
        <line x1="468" y1="228" x2="546" y2="228" marker-end="url(#pipe-arrow)" />

        <!-- headers fan out into every row -->
        <path d="M254 44 V106" marker-end="url(#pipe-arrow)" />
        <path d="M194 26 H150 V190 H254 V206" marker-end="url(#pipe-arrow)" />

        <!-- object files converge on the linker -->
        <path d="M638 228 H680 Q712 228 712 190 V150" marker-end="url(#pipe-arrow)" />
        <path d="M764 290 V152" marker-end="url(#pipe-arrow)" />
      </g>

      <!-- ── pulses ───────────────────────────────────────────────────── -->
      <circle class="ns-pipe__pulse" r="5">
        <animateMotion dur="5s" repeatCount="indefinite"><mpath href="#pipe-a" /></animateMotion>
      </circle>

      <circle class="ns-pipe__pulse ns-pipe__pulse--ghost" r="4">
        <animateMotion dur="5s" begin="1.2s" repeatCount="indefinite"><mpath href="#pipe-b" /></animateMotion>
      </circle>
      <circle class="ns-pipe__pulse" r="4">
        <animateMotion dur="2.2s" begin="0.3s" repeatCount="indefinite"><mpath href="#pipe-h" /></animateMotion>
      </circle>
      <circle class="ns-pipe__pulse" r="4">
        <animateMotion dur="2.2s" begin="2.6s" repeatCount="indefinite"><mpath href="#pipe-l" /></animateMotion>
      </circle>

      <!-- ── stage names, in the gaps between the boxes ───────────────── -->
      <g class="ns-pipe__stage">
        <text x="169" y="96">preprocessing</text>
        <text x="339" y="96">compilare</text>
        <text x="509" y="96">asamblare</text>
        <text x="679" y="96">linking</text>
      </g>

      <!-- ── row 1: main.c ────────────────────────────────────────────── -->
      <g class="ns-pipe__node">
        <rect x="40" y="110" width="88" height="36" rx="7" />
        <text x="84" y="133">main.c</text>
        <rect x="210" y="110" width="88" height="36" rx="7" />
        <text x="254" y="133">main.i</text>
        <rect x="380" y="110" width="88" height="36" rx="7" />
        <text x="424" y="133">main.s</text>
        <rect x="550" y="110" width="88" height="36" rx="7" />
        <text x="594" y="133">main.o</text>
      </g>

      <!-- ── row 2: every other source file ───────────────────────────── -->
      <g class="ns-pipe__node ns-pipe__node--ghost">
        <rect x="40" y="210" width="88" height="36" rx="7" />
        <text x="84" y="233">utils.c</text>
        <rect x="210" y="210" width="88" height="36" rx="7" />
        <text x="254" y="233">utils.i</text>
        <rect x="380" y="210" width="88" height="36" rx="7" />
        <text x="424" y="233">utils.s</text>
        <rect x="550" y="210" width="88" height="36" rx="7" />
        <text x="594" y="233">utils.o</text>
      </g>
      <text class="ns-pipe__aside" x="84" y="274">× fiecare fișier .c</text>

      <!-- ── side inputs ──────────────────────────────────────────────── -->
      <g class="ns-pipe__node ns-pipe__node--side">
        <rect x="194" y="8" width="120" height="36" rx="7" />
        <text x="254" y="31">stdio.h</text>
        <rect x="704" y="290" width="120" height="36" rx="7" />
        <text x="764" y="313">libc libm</text>
      </g>

      <!-- ── linker and result ────────────────────────────────────────── -->
      <g class="ns-pipe__node ns-pipe__node--tool">
        <rect x="720" y="110" width="88" height="36" rx="7" />
        <text x="764" y="133">ld</text>
      </g>
      <g class="ns-pipe__node ns-pipe__node--out">
        <rect x="858" y="110" width="76" height="36" rx="7" />
        <text x="896" y="133">hello</text>
      </g>

    </svg>
  </div>
</template>

<style scoped>
.ns-pipe svg {
  width: 100%;
  height: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.ns-pipe__wire line,
.ns-pipe__wire path {
  fill: none;
  stroke: var(--neversink-admon-border-color);
  stroke-width: 1.5;
}

.ns-pipe__node rect {
  fill: #fff;
  stroke: var(--neversink-admon-border-color);
  stroke-width: 1.5;
}

.ns-pipe__node text {
  fill: var(--neversink-fg-color);
  font-size: 15px;
  text-anchor: middle;
}

/* Every other source file: present, unlabelled in the mind, clearly the same
   chain happening again. */
.ns-pipe__node--ghost { opacity: 0.38; }

.ns-pipe__node--side rect,
.ns-pipe__node--tool rect {
  fill: var(--neversink-bg-color);
}

.ns-pipe__node--out rect {
  fill: var(--neversink-admon-bg-color);
  stroke: var(--neversink-border-color);
  stroke-width: 2.5;
}

.ns-pipe__stage text {
  fill: var(--neversink-text-color);
  font-size: 11.5px;
  letter-spacing: 0.04em;
  text-anchor: middle;
  opacity: 0.8;
}

.ns-pipe__aside {
  fill: var(--neversink-text-color);
  font-size: 12px;
  text-anchor: middle;
  opacity: 0.5;
}

.ns-pipe__pulse {
  fill: var(--neversink-border-color);
}

.ns-pipe__pulse--ghost { opacity: 0.45; }

@media (prefers-reduced-motion: reduce) {
  .ns-pipe__pulse { display: none; }
}
</style>
