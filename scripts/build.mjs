#!/usr/bin/env node

/**
 * Build orchestration for the multi-deck lesson site.
 *
 * Each deck is an independent Slidev app, so each one is built separately with
 * its own `--base`. The results are assembled into a single dist/ tree:
 *
 *   dist/                  hub (slides/00-hub)
 *   dist/01-intro/         lesson 1
 *   dist/02-data-types/    lesson 2
 *   …
 *
 * GitHub Pages serves the site from a repository subpath, so the base path
 * prefix comes from the BASE_PATH env var.
 *
 * Usage:
 *   node scripts/build.mjs
 *   node scripts/build.mjs --only 05-arrays        # rebuild one deck in place
 *   BASE_PATH=/programming-fundamentals node scripts/build.mjs
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SLIDEV_BIN, childEnv } from './node-compat.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const SLIDES_DIR = path.join(ROOT, 'slides')
const HUB_DIR = path.join(SLIDES_DIR, '00-hub')

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

const log = (msg, color = 'reset') => console.log(`${colors[color]}${msg}${colors.reset}`)

function section(title) {
  console.log(`\n${'='.repeat(60)}`)
  log(title, 'bright')
  console.log(`${'='.repeat(60)}\n`)
}

const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'common', 'lessons.json'), 'utf8'))

/** Trailing slash removed so we can compose `${PREFIX}/${slug}/` predictably. */
const PREFIX = (process.env.BASE_PATH || '').replace(/\/$/, '')

const CHILD_ENV = childEnv({ BASE_PATH: PREFIX })

/**
 * Every deck to build, in publish order.
 * `slug` is null for the hub, which is published at the site root.
 */
function discoverDecks() {
  const decks = []

  if (!fs.existsSync(path.join(HUB_DIR, 'slides.md'))) {
    log('❌ Hub deck missing at slides/00-hub/slides.md', 'red')
    process.exit(1)
  }
  decks.push({ name: 'hub', slug: null, dir: HUB_DIR })

  for (const lesson of registry.lessons) {
    const dir = path.join(SLIDES_DIR, lesson.slug)
    if (!fs.existsSync(path.join(dir, 'slides.md'))) {
      log(`⚠️  ${lesson.slug} is in the registry but has no deck — skipped`, 'yellow')
      continue
    }
    decks.push({ name: lesson.slug, slug: lesson.slug, dir })
  }

  return decks
}

function buildDeck(deck) {
  const outDir = deck.slug ? path.join(DIST, deck.slug) : DIST
  const base = `${PREFIX}/${deck.slug ? `${deck.slug}/` : ''}`
  const entry = path.join(deck.dir, 'slides.md')

  log(`\n📦 ${deck.name}`, 'cyan')
  log(`   base: ${base}`, 'blue')

  try {
    // execFileSync, not a shell string: paths and slugs never reach a shell.
    execFileSync(process.execPath, [SLIDEV_BIN, 'build', entry, '--out', outDir, '--base', base], {
      stdio: 'inherit',
      cwd: ROOT,
      env: CHILD_ENV,
    })
    log(`✅ ${deck.name}`, 'green')
  } catch (error) {
    log(`❌ Failed to build ${deck.name}: ${error.message}`, 'red')
    process.exit(1)
  }
}

function main() {
  const start = Date.now()
  const onlyIndex = process.argv.indexOf('--only')
  const only = onlyIndex !== -1 ? process.argv[onlyIndex + 1] : null

  section('🎬 Programming Fundamentals Lessons — build')
  if (PREFIX) log(`Base path prefix: ${PREFIX}`, 'yellow')

  let decks = discoverDecks()

  if (only) {
    decks = decks.filter(d => d.name === only)
    if (decks.length === 0) {
      log(
        `❌ No deck named "${only}". Available: ${discoverDecks().map(d => d.name).join(', ')}`,
        'red'
      )
      process.exit(1)
    }
    log(`Rebuilding only: ${only}`, 'yellow')
  } else {
    log('Cleaning dist/...', 'yellow')
    fs.rmSync(DIST, { recursive: true, force: true })
    fs.mkdirSync(DIST, { recursive: true })
  }

  section(`🏗️  Building ${decks.length} deck(s)`)
  decks.forEach(buildDeck)

  section('🚀 Finalizing')
  fs.writeFileSync(path.join(DIST, '.nojekyll'), '', 'utf8')
  log('✅ Wrote .nojekyll (GitHub Pages)', 'green')

  execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'fix-spa-routing.mjs')], {
    stdio: 'inherit',
    cwd: ROOT,
    env: CHILD_ENV,
  })

  section('✨ Done')
  log(`Total: ${((Date.now() - start) / 1000).toFixed(1)}s`, 'green')
  log('Preview with: pnpm preview\n', 'cyan')
}

main()
