<script setup lang="ts">
// The file lives in common/public/ and is served at the deck root by
// multiPublicPlugin — but only at runtime. A literal src="/moodle-qr.svg" is
// resolved by Vite's import analysis against this deck's own (nonexistent)
// public/ dir and fails the build, so the URL is built here instead. Same
// reason as <GithubLink>: BASE_URL, not './', because Slidev also serves
// /presenter/12 and /overview, where a relative path points one level too deep.
const src = `${import.meta.env.BASE_URL}moodle-qr.svg`

withDefaults(defineProps<{ size?: number; alt?: string }>(), {
  size: 256,
  alt: 'Cod QR către cursul de pe Moodle',
})
</script>

<template>
  <!-- The white card is not decoration: the code is black on white, and on a
       dark background a transparent image would stop scanning. -->
  <div class="ns-qr">
    <img :src="src" :alt="alt" :width="size" :height="size" />
  </div>
</template>

<style scoped>
.ns-qr {
  padding: 1rem;
  border-radius: 0.75rem;
  background: #ffffff;
  border: 1px solid var(--neversink-admon-border-color);
}
.ns-qr img {
  display: block;
}
</style>
