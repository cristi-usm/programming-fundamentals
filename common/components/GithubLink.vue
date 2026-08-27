<script setup lang="ts">
import { REPO } from '../labs'

/** Defaults to the repo recorded in labs.json; override with `repo`. */
const props = defineProps<{ repo?: string }>()

const href = props.repo ?? REPO

// BASE_URL, not './' — Slidev also serves /presenter/12 and /overview, where a
// URL relative to the current path would resolve outside the deck's public dir.
const icon = `${import.meta.env.BASE_URL}github.svg`
</script>

<template>
  <a :href="href" target="_blank" rel="noopener noreferrer">
    <img :src="icon" alt="GitHub Repo" />
  </a>
</template>
