---
name: slide-reveals
description: Progressive reveals in this course — the v-click policy (clicks exist only in the lesson being taught and are stripped everywhere else), explicit click numbers when reveals nest, registering a slide's click count from markdown, and the two patterns for animated components (click-driven with an autoplay fallback, or pure autoplay). Use when adding a v-click to a slide, when clicks advance without anything changing on screen, or when writing a component that animates a process.
---

# Reveals and animated components

## The policy

`v-click` is allowed, but it is **pacing, not meaning**. Every deck whose slug is not
`THEME_CONFIG.currentLesson` has its reveals removed from the markdown before Vue compiles
the slide — see `common/setup/transformers.ts` and CLAUDE.md §4.

So there are two audiences for every slide:

| | lecture (`currentLesson`) | archive (every other deck) |
|---|---|---|
| `v-click` | reveals on click | directive deleted; content visible, zero click steps |

**A slide must read correctly with every reveal removed.** Never rely on click order to
carry meaning — no "first this, *then* the contradiction", no punchline that only works
because the setup was hidden. Most students only ever see the flat version.

Preview either form without touching the config:

```bash
FP_CLICKS=strip pnpm dev:01-intro   # what students see later
FP_CLICKS=keep  pnpm dev:03-io      # force the lecture form
```

Both are read at server start — changing one needs a restart.

## Clicks on a markdown list

`v-click` goes on **one element**, and a markdown list is a single block. To reveal items
one at a time, write the list as HTML:

```markdown
<ol class="list-decimal list-inside space-y-2">
<li v-click="2">Ține minte primul număr.</li>
<li v-click="3">Treci la următorul.</li>
</ol>
```

The fenced-code exemption in the transformer means a slide can still *show* `v-click` in a
code block without it being stripped.

## Number the clicks whenever they nest ⚠️

If a clicked element sits inside another clicked element, **write the numbers explicitly**:

```markdown
<div v-click="1">                 <!-- the card -->
  <li v-click="2">…</li>          <!-- its contents -->
```

Without numbers, the ids are handed out in registration order, which is not the order they
appear on screen. The symptom is unmistakable and confusing: *you press Space several times
and nothing changes*, then the whole block appears at once — the inner reveals were firing
inside a container that was still invisible.

## Animated components

Two patterns, and the choice is about what drives the animation.

### 1. Click-driven, with an autoplay fallback

For an animation the presenter should pace — one step per click. It must still work when
the reveals are stripped, or it freezes at step 0 forever:

```ts
const { clicks, clicksTotal } = useNav()

// No clicks on this slide at all: the reveals were stripped, so play alone.
const selfDriven = computed(() => clicksTotal.value === 0)

const step = computed(() =>
  selfDriven.value ? autoStep.value : clamp(clicks.value - props.firstClick, -1, LAST))
```

`clicksTotal` is **not known at mount** — it settles once the slide's `v-click`s have
registered — so start the fallback timer from a `watch(selfDriven, …, { immediate: true })`,
not from `onMounted`.

**The click count must be registered from the markdown**, not from inside the component:
the transformer strips markdown only, so a `v-click` living in a `.vue` file would survive
into the archived deck, keep `clicksTotal` above zero, and the fallback would never fire.
Put the highest number on a real element that should appear last:

```markdown
<MaxScan :first-click="1" />

<div v-click="6" class="mt-8">   <!-- also tells Slidev the slide has 6 clicks -->
```

Take `firstClick` as a prop so inserting a reveal above the component is a one-number edit.

Examples: `slides/01-intro/components/AverageMachine.vue`, `MaxScan.vue`.

### 2. Pure autoplay

For a loop that should just run — no relationship to presentation state, identical in both
decks. Simpler; prefer it unless the presenter genuinely needs to pace the steps.

### Drawing rules

- **Show the process, not the answer.** A number that counts 0 → 17 → 27 shows an
  accumulator being built; printing `27` shows the result and hides the mechanism. CSS
  cannot interpolate text content — drive counters with `requestAnimationFrame`.
- **Dim, don't delete.** Elements the algorithm has passed over stay visible at low opacity,
  so the walk remains traceable.
- Re-trigger a keyframe animation by changing a `:key` — remounting replays it. Re-applying
  a class does not.
- Add a `prefers-reduced-motion` block that collapses durations.
