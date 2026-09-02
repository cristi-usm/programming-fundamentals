<script setup lang="ts">
/**
 * A collage of logos, for "there are far more of these than we can cover".
 *
 * The files come from `common/public/icons/<dir>/<name>.svg` — checked into the
 * repository, so the wall does not depend on any icon package staying installed
 * and nothing is fetched at presentation time.
 *
 *   <LogoWall :names="['python', 'rust', 'go']" />
 *   <LogoWall :names="[…]" :size="60" dim />
 *   <LogoWall :names="[…]" :animate="false" />
 *
 * The wall arrives scattered rather than all at once: each logo fades in on its
 * own delay, then breathes — some swelling, some shrinking, each on its own
 * period. The numbers come from a hash of the name, not from Math.random, so a
 * given wall looks the same every time the slide is revisited.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** File names without the extension. */
    names: string[]
    /** Folder under `public/icons/`. */
    dir?: string
    /** Logo size in px. */
    size?: number
    /** Fade the wall back, for when it is a backdrop rather than the subject. */
    dim?: boolean
    /** Scattered entrance and the slow breathing afterwards. */
    animate?: boolean
  }>(),
  { dir: 'languages', size: 54, dim: false, animate: true },
)

/** Stable pseudo-random in [0, 1) from a string — same wall on every visit. */
function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

const base = import.meta.env.BASE_URL
const logos = computed(() =>
  props.names.map((name, i) => {
    const a = hash(name)
    const b = hash(`${name}#${i}`)
    return {
      name,
      src: `${base}icons/${props.dir}/${name}.svg`,
      style: {
        width: `${props.size}px`,
        height: `${props.size}px`,
        '--ns-lw-rot': `${(a * 12 - 6).toFixed(1)}deg`,
        '--ns-lw-in-delay': `${(a * 0.8).toFixed(2)}s`,
        '--ns-lw-breathe': `${(1.8 + b * 1.8).toFixed(2)}s`,
        '--ns-lw-breathe-delay': `${(b * 1.5).toFixed(2)}s`,
        // Half the wall swells while the other half shrinks, so the motion
        // reads as a crowd shifting rather than one synchronised pulse.
        '--ns-lw-from': `${(b < 0.5 ? 0.82 + a * 0.06 : 1).toFixed(3)}`,
        '--ns-lw-to': `${(b < 0.5 ? 1 : 1.18 + a * 0.1).toFixed(3)}`,
      },
    }
  }),
)
</script>

<template>
  <div :class="['ns-logowall', { 'ns-logowall--dim': dim, 'ns-logowall--animate': animate }]">
    <img v-for="logo in logos" :key="logo.name" :src="logo.src" :alt="logo.name"
      class="ns-logowall__logo" :style="logo.style" />
  </div>
</template>

<style scoped>
.ns-logowall {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.4rem 1.8rem;
}

.ns-logowall__logo {
  object-fit: contain;
  /* Staggered so the wall reads as a scattered pile, not a spreadsheet. */
  transform: rotate(var(--ns-lw-rot, -3deg));
}

/* Entrance first, breathing after — two animations on one element, the second
   delayed past the end of the first. */
.ns-logowall--animate .ns-logowall__logo {
  animation:
    ns-logowall-in 0.35s ease-out var(--ns-lw-in-delay) both,
    ns-logowall-breathe var(--ns-lw-breathe) ease-in-out
      calc(var(--ns-lw-in-delay) + 0.35s + var(--ns-lw-breathe-delay)) infinite alternate;
}

@keyframes ns-logowall-in {
  from {
    opacity: 0;
    transform: rotate(var(--ns-lw-rot)) scale(0.6);
  }
  to {
    opacity: 1;
    transform: rotate(var(--ns-lw-rot)) scale(1);
  }
}

@keyframes ns-logowall-breathe {
  from {
    transform: rotate(var(--ns-lw-rot)) scale(var(--ns-lw-from));
  }
  to {
    transform: rotate(var(--ns-lw-rot)) scale(var(--ns-lw-to));
  }
}

/* A projector is not the place to argue with someone's motion settings. */
@media (prefers-reduced-motion: reduce) {
  .ns-logowall--animate .ns-logowall__logo {
    animation: none;
  }
}

.ns-logowall--dim {
  opacity: 0.55;
}
</style>
