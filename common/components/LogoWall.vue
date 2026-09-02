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
  }>(),
  { dir: 'languages', size: 54, dim: false },
)

const base = import.meta.env.BASE_URL
const logos = computed(() =>
  props.names.map((name) => ({ name, src: `${base}icons/${props.dir}/${name}.svg` })),
)
</script>

<template>
  <div :class="['ns-logowall', { 'ns-logowall--dim': dim }]">
    <img v-for="logo in logos" :key="logo.name" :src="logo.src" :alt="logo.name"
      class="ns-logowall__logo" :style="{ width: `${size}px`, height: `${size}px` }" />
  </div>
</template>

<style scoped>
.ns-logowall {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.6rem 2rem;
}

.ns-logowall__logo {
  object-fit: contain;
  /* Staggered so the wall reads as a scattered pile, not a spreadsheet. */
  transform: rotate(-3deg);
}

.ns-logowall__logo:nth-child(even) {
  transform: rotate(4deg) translateY(-4px);
}

.ns-logowall__logo:nth-child(3n) {
  transform: rotate(-6deg) translateY(3px);
}

.ns-logowall--dim {
  opacity: 0.55;
}
</style>
