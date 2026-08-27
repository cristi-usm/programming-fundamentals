import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'

const require = createRequire(import.meta.url)

/**
 * Absolute path to Slidev's CLI entry point.
 *
 * Spawn it with `process.execPath` rather than going through `npx`: npx is npm,
 * and npm warns about every `npm_config_*` variable pnpm puts in the
 * environment ("Unknown env config …"). With 12 decks that is 12 warnings per
 * run. Resolving the module directly skips npm entirely — and one less process
 * per deck.
 */
export const SLIDEV_BIN = require.resolve('@slidev/cli/bin/slidev.mjs')

/**
 * Environment for spawned Slidev processes.
 *
 * Node 25 exposes a global `localStorage` that is not a functional Storage
 * unless a backing file was given. `@typescript/vfs` (a transitive dependency
 * of Slidev) runs
 *
 *   hasLocalStorage && localStorage.getItem('DEBUG')
 *
 * at module load, which throws and kills both `slidev` and `slidev build`.
 * Pointing the flag at a scratch file makes the global functional.
 *
 * The flag is only added when the broken global is actually detected, so this is
 * a no-op on the Node versions this project targets (see .node-version). Remove
 * once Slidev ships a fixed @typescript/vfs.
 */
/**
 * Is `globalThis.localStorage` present but non-functional?
 *
 * Reading a property off it is itself what makes Node emit
 * "`--localstorage-file` was provided without a valid path", so the probe runs
 * with warnings muted — otherwise detecting the problem would print the very
 * noise we are trying to avoid.
 */
function localStorageIsBroken() {
  if (typeof globalThis.localStorage === 'undefined') return false

  const emitWarning = process.emitWarning
  process.emitWarning = () => {}
  try {
    return typeof globalThis.localStorage.getItem !== 'function'
  } catch {
    return true
  } finally {
    process.emitWarning = emitWarning
  }
}

export function childEnv(extra = {}) {
  const env = { ...process.env, ...extra }

  if (localStorageIsBroken()) {
    const file = path.join(os.tmpdir(), 'programming-fundamentals-lab-localstorage')
    env.NODE_OPTIONS = `${env.NODE_OPTIONS ?? ''} --localstorage-file=${file}`.trim()
  }

  return env
}
