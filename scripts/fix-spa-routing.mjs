#!/usr/bin/env node

/**
 * SPA routing fallback for static hosts (GitHub Pages in particular).
 *
 * Each deck is an independent Slidev SPA. A deep link like
 * /programming-fundamentals-lab/05-arrays/12 is not a real file, so the host serves a 404
 * instead of the deck. Two things fix that:
 *
 *   1. Every deck gets a 404.html that is a copy of its own index.html, so the
 *      host serves the right SPA and Slidev reads the slide number off the URL.
 *   2. The root 404.html catches anything that missed a deck directory,
 *      remembers the requested path, and redirects into the matching deck.
 *
 * Run automatically at the end of scripts/build.mjs.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/$/, '')

const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'common', 'labs.json'), 'utf8'))

/** Every slug that *could* be a deck, per the registry. */
const REGISTERED_SLUGS = [...registry.labs.map(l => l.slug)]

/**
 * Slugs that actually made it into dist/.
 *
 * A registry entry without a slides.md is skipped by scripts/build.mjs, but its
 * card on the hub stays clickable. Advertising such a slug in the root 404
 * dispatcher would send the visitor to a directory that does not exist — which
 * 404s straight back into the dispatcher, forever.
 */
function builtSlugs() {
  return REGISTERED_SLUGS.filter(slug => fs.existsSync(path.join(DIST, slug)))
}

/**
 * Root 404.html: figure out which deck was asked for and hand off to it.
 * The original path goes into sessionStorage so the deck can restore it.
 */
function writeRootFallback(slugs) {
  const html = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Redirecting…</title>
<script>
  (function () {
    var slugs = ${JSON.stringify(slugs)};
    var base = ${JSON.stringify(BASE_PATH)};
    var path = window.location.pathname;

    var segments = path.split('/').filter(Boolean);
    var deck = null;
    for (var i = 0; i < segments.length; i++) {
      if (slugs.indexOf(segments[i]) !== -1) { deck = segments[i]; break; }
    }

    var target = base + '/' + (deck ? deck + '/' : '');

    // The target is served by this same 404 page when it does not exist, so
    // redirecting onto it would loop. Stop and say so instead.
    if (target === path || target === path + '/') {
      document.getElementById('msg').textContent =
        'Pagina nu există: ' + path;
      return;
    }

    // Remembered so the deck can restore the slide the visitor asked for.
    sessionStorage.setItem('spa-redirect', path);
    window.location.replace(target);
  })();
</script>
</head>
<body><p id="msg">Redirecting…</p></body>
</html>
`
  fs.writeFileSync(path.join(DIST, '404.html'), html, 'utf8')
  console.log('  ✅ Root 404.html (deck dispatch)')
}

/**
 * Restore the pre-redirect URL before Slidev boots, so its router reads the
 * slide the visitor actually asked for.
 */
const REDIRECT_HANDLER = `
  <script id="spa-redirect-handler">
    (function () {
      var target = sessionStorage.getItem('spa-redirect');
      if (!target) return;
      sessionStorage.removeItem('spa-redirect');
      // Rewrite the URL synchronously, before Slidev's router initialises.
      try {
        window.history.replaceState(null, '', target);
      } catch (e) {
        window.location.href = target;
      }
    })();
  </script>
`

function injectHandler(indexPath, label) {
  if (!fs.existsSync(indexPath)) {
    console.log(`  ⚠️  ${label}: index.html not found — skipped`)
    return false
  }

  let content = fs.readFileSync(indexPath, 'utf8')
  if (content.includes('spa-redirect-handler')) return true

  content = content.replace(/<head>/i, `<head>${REDIRECT_HANDLER}`)
  fs.writeFileSync(indexPath, content, 'utf8')
  return true
}

function processDeck(slug) {
  const dir = path.join(DIST, slug)
  const indexPath = path.join(dir, 'index.html')

  if (!injectHandler(indexPath, slug)) return

  // A deck's own 404.html must be its own SPA, not the hub's.
  fs.copyFileSync(indexPath, path.join(dir, '404.html'))
  console.log(`  ✅ ${slug}`)
}

function main() {
  console.log('\n🔧 SPA routing fallback')
  console.log(`   base: ${BASE_PATH || '/'}\n`)

  if (!fs.existsSync(DIST)) {
    console.error('❌ dist/ does not exist — run the build first.')
    process.exit(1)
  }

  const slugs = builtSlugs()
  const skipped = REGISTERED_SLUGS.filter(slug => !slugs.includes(slug))
  if (skipped.length) {
    console.log(`  ⚠️  not built, excluded from the dispatcher: ${skipped.join(', ')}`)
  }

  writeRootFallback(slugs)
  if (injectHandler(path.join(DIST, 'index.html'), 'hub')) console.log('  ✅ hub')

  for (const slug of slugs) processDeck(slug)

  console.log('')
}

main()
