<script setup>
import { onMounted, ref, computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { currentSlug, deckUrl } from '../labs'

/**
 * Page-number footer, shown on every slide of every deck.
 *
 * Ported from the single-deck `slide-bottom.vue`: the colours still follow the
 * slide's neversink `color:` frontmatter, but the counter now links back to the
 * hub's lab grid instead of slide 2 of one giant deck. Inside the hub that is a
 * same-app route, so it stays a Slidev <Link>; from a lab deck it is a real
 * navigation to another origin/port.
 */
const { $slidev, $frontmatter } = useSlideContext()

const fg_default = 'text-neutral-800'
const bg_default = 'bg-neutral-100'
const fg = ref(fg_default)
const bg = ref(bg_default)

const inHub = computed(() => currentSlug() === null)
const hubHref = computed(() => deckUrl(null, 2))

function process_colors() {
    if ($frontmatter.color) {
        if ($frontmatter.color == 'black') {
            fg.value = `text-gray-600`
            bg.value = `bg-gray-100`
        } else if ($frontmatter.color == 'white') {
            fg.value = fg_default
            bg.value = bg_default
        } else if ($frontmatter.color == 'dark') {
            fg.value = `text-gray-100`
            bg.value = `bg-gray-500`
        } else if ($frontmatter.color == 'navy') {
            fg.value = `text-gray-300`
            bg.value = `bg-gray-600`
        } else if ($frontmatter.color == 'light') {
            fg.value = `text-neutral-600`
            bg.value = `bg-neutral-300`
        } else if ($frontmatter.color.includes('-light')) {
            const parts = $frontmatter.color.split('-')
            fg.value = `text-${parts[0]}-100`
            bg.value = `bg-${parts[0]}-500`
        } else {
            fg.value = `text-${$frontmatter.color}-500`
            bg.value = `bg-${$frontmatter.color}-100`
        }
    }
}

function checkvars() {
    if ($frontmatter.slide_info_color === undefined) {
        // default
        fg.value = fg_default
        bg.value = bg_default
    }

    if ($frontmatter.slide_info_color && $frontmatter.slide_info_color.includes(',')) {
        // slide info
        const parts = $frontmatter.slide_info.split(',')
        fg.value = parts[0]
        bg.value = parts[1]
    } else {
        // slide specific things
        if ($frontmatter.layout == 'end') {
            fg.value = `text-neutral-100`
            bg.value = `bg-neutral-800`
        } else if ($frontmatter.layout == 'side-title') {
            // if side title
            if ($frontmatter.side && ($frontmatter.side == 'right' || $frontmatter.side == 'r')) {
                process_colors()
            } else {
                fg.value = fg_default
                bg.value = bg_default
            }
        } else if (
            $frontmatter.layout == 'cover' ||
            $frontmatter.layout == 'intro' ||
            $frontmatter.layout == 'default' ||
            $frontmatter.layout == 'section' ||
            $frontmatter.layout == 'credits' ||
            $frontmatter.layout == 'full'
        ) {
            process_colors()
        }
    }
}

onMounted(() => {
    checkvars()
})
</script>

<template>
    <footer class="absolute bottom-1 right-1 left-0 p-2 pr-3 full-width z-10">
        <component :is="inHub ? 'Link' : 'a'" :to="inHub ? '2' : undefined" :href="inHub ? undefined : hubHref">
            <div class="absolute bottom-0 right-0 p-2 pr-2">
                <span class="pl-3 pr-3 p-2 font-mono font-size-2" :class="fg + ' ' + bg">
                    <mdi-orbit />&nbsp;<span class="fw-bold">
                    </span> | {{ $slidev.nav.currentPage }} of
                    {{ $slidev.nav.total }}
                </span>
            </div>
        </component>
    </footer>
</template>

<style scoped></style>
