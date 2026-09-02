/**
 * Our own `c` / `cpp` code runners (the cpp-runner addon stays OUT of the
 * headmatter `addons:` list — both register a `c` runner and the addon's
 * would shadow ours).
 *
 * The output area is a faithful simulation of a local terminal session:
 *
 *   $ gcc program.c -o program
 *   $ ./program
 *   Introduceti doua note: 9 8
 *   Media este 8.50
 *   $
 *
 * Nothing appears that would not appear locally — no prefixes, no banners.
 * A prompt printed without `\n` keeps the input caret on the same line,
 * because what is shown is the program's REAL output up to the moment it
 * blocked on stdin:
 *
 * How: Coliru is a one-shot API, so each interaction re-runs the program with
 * the input collected so far, under `timeout` with unbuffered stdout and
 * stdin held open. A program that needs more input blocks and gets killed
 * (exit 124) — everything it printed up to the read is captured verbatim.
 * The client shows only the not-yet-shown part of the output, echoes what
 * the user types (as a tty would), and repeats. Exit != 124 means the
 * program finished. Deterministic programs replay identically, so the
 * simulation is exact; the cost is one Coliru round trip per input line.
 *
 * A slide can pre-feed input (each line answers one wait) and skip typing:
 *
 *   ---
 *   c:
 *     stdin: '9 8'
 *   ---
 *
 * Config is read from the CURRENT slide's frontmatter (headmatter = slide 1
 * only). Each deck's `setup/code-runners.ts` re-exports this file.
 */
import { useNav } from '@slidev/client'
import type { CodeRunnerContext, CodeRunnerOutput, CodeRunnerProviders } from '@slidev/types'
import { defineCodeRunnersSetup } from '@slidev/types'

const COMPILE_URL = 'https://coliru.stacked-crooked.com/compile'
const RUN_MARKER = '__FP_RUN__'
const EXIT_MARKER = '\n__FP_MARK__:'

type Lang = 'c' | 'cpp'

interface RunnerConfig {
  compiler?: string
  standard?: string
  optimization?: string
  flags?: string
  libraries?: string
  extraCommands?: string
  /** Pre-fed input: line N answers the program's Nth wait. */
  stdin?: string
}

// -Wno-unused-result: glibc marks scanf warn_unused_result; checking its
// return value is lesson 3 material — earlier examples must run clean.
const DEFAULTS: Record<Lang, Required<Omit<RunnerConfig, 'stdin'>>> = {
  c: {
    compiler: 'g++',
    standard: 'c2x',
    optimization: 'O2',
    flags: '-Wall -Wextra -pedantic -pthread -pedantic-errors -Wno-format -Wno-format-security -Wno-format-extra-args -Wno-unused-result',
    libraries: '-lm -latomic',
    extraCommands: '',
  },
  cpp: {
    compiler: 'g++',
    standard: 'c++17',
    optimization: 'O2',
    flags: '-Wall -Wextra -pedantic -pthread -pedantic-errors -Wno-format -Wno-format-security -Wno-format-extra-args -Wno-unused-result',
    libraries: '-lm -latomic',
    extraCommands: '',
  },
}

/** The `c:` / `cpp:` block from the current slide's frontmatter. */
function slideConfig(lang: Lang): Partial<RunnerConfig> {
  const { currentPage, slides } = useNav()
  const slide = slides.value?.find(s => s.no === currentPage.value)
  return (slide?.meta.slide?.frontmatter?.[lang] as Partial<RunnerConfig>) || {}
}

function buildCmd(config: RunnerConfig, lang: Lang, stdinLines: string[]): string {
  const compile = [
    config.compiler,
    lang === 'c' ? '-x c' : '',
    `-std=${config.standard}`,
    `-${config.optimization}`,
    config.flags,
    'main.cpp',
    config.libraries,
  ].filter(Boolean).join(' ')

  // Input travels as a quoted heredoc — no shell-escaping rules to trip over
  // (only a literal `__FP_STDIN__` line would break it).
  const writeStdin = stdinLines.length
    ? `cat > stdin.txt <<'__FP_STDIN__'\n${stdinLines.join('\n')}\n__FP_STDIN__\n`
    : '> stdin.txt\n'

  // The run: stdin gets the collected input, then stays OPEN (sleep) so a
  // program needing more blocks instead of reading EOF; `timeout` kills it
  // there (exit 124 = "waiting for input") and `stdbuf -o0` makes sure the
  // partial-line prompt it printed was flushed and captured.
  const extra = config.extraCommands ? `; ${config.extraCommands}` : ''
  return (
    `${writeStdin}${compile} 2>&1 | sed 's/main\\.cpp/program.c/g'; `
    + `if [ -x a.out ]; then echo ${RUN_MARKER}; `
    + `timeout 2 stdbuf -o0 -e0 ./a.out < <(cat stdin.txt; sleep 4) 2>&1; `
    + `printf '${EXIT_MARKER.replace('\n', '\\n')}%s\\n' "$?"${extra}; `
    + `else printf '${EXIT_MARKER.replace('\n', '\\n')}FAIL\\n'; fi`
  )
}

async function coliru(cmd: string, src: string): Promise<string> {
  const response = await fetch(COMPILE_URL, {
    method: 'POST',
    body: JSON.stringify({ cmd, src: `${src}\n` }),
    cache: 'no-cache',
  })
  return await response.text()
}

function runTerminal(code: string, lang: Lang, config: RunnerConfig): CodeRunnerOutput {
  const autoInputs = config.stdin != null ? config.stdin.split('\n') : []

  const root = document.createElement('div')
  root.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, monospace'
  root.style.fontSize = '0.9em'
  root.style.lineHeight = '1.6'

  const out = document.createElement('span')
  out.style.whiteSpace = 'pre-wrap'
  out.style.wordBreak = 'break-word'
  root.appendChild(out)

  // The caret: a borderless inline input flowing right after the last output
  // character — exactly where a local cursor would sit.
  const input = document.createElement('input')
  input.type = 'text'
  input.setAttribute('aria-label', 'stdin')
  input.autocomplete = 'off'
  input.spellcheck = false
  input.style.font = 'inherit'
  input.style.color = 'inherit'
  input.style.background = 'transparent'
  input.style.border = 'none'
  input.style.outline = 'none'
  input.style.padding = '0'
  input.style.margin = '0'
  input.style.width = '2ch'
  input.style.display = 'none'
  input.style.verticalAlign = 'baseline'
  input.addEventListener('input', () => {
    input.style.width = `${Math.max(2, input.value.length + 1)}ch`
  })
  root.appendChild(input)

  const print = (text: string) => {
    out.textContent += text
  }

  let shownProgOut = ''
  let firstRound = true
  const inputs: string[] = []

  const finishSession = () => {
    input.remove()
    print('$ ')
  }

  const round = async () => {
    input.style.display = 'none'
    try {
      const resp = await coliru(buildCmd(config, lang, inputs), code)

      const markPos = resp.lastIndexOf(EXIT_MARKER)
      if (markPos < 0) {
        print(`${resp}\n[runner] răspuns neașteptat de la Coliru\n`)
        return
      }
      const exitCode = resp.slice(markPos + EXIT_MARKER.length).trim()
      const body = resp.slice(0, markPos)

      const runPos = body.indexOf(`${RUN_MARKER}\n`)
      const diagnostics = runPos >= 0 ? body.slice(0, runPos) : body
      const progOut = runPos >= 0 ? body.slice(runPos + RUN_MARKER.length + 1) : ''

      if (firstRound) {
        firstRound = false
        print(`$ gcc program.c -o program\n`)
        print(diagnostics)
        if (exitCode === 'FAIL') {
          finishSession()
          return
        }
        print(`$ ./program\n`)
      }

      // Only the not-yet-shown tail — the replayed prefix is identical.
      print(progOut.slice(shownProgOut.length))
      shownProgOut = progOut

      if (exitCode === '124') {
        // Blocked on a read: it wants input.
        const auto = autoInputs.shift()
        if (auto != null) {
          print(`${auto}\n`)
          inputs.push(auto)
          void round()
          return
        }
        input.style.display = 'inline-block'
        input.value = ''
        input.style.width = '2ch'
        input.focus()
      }
      else {
        finishSession()
      }
    }
    catch (error) {
      print(`\n[runner] ${error instanceof Error ? error.message : String(error)}\n`)
    }
  }

  input.addEventListener('keydown', (event) => {
    // Keep slide navigation (space/arrows) from stealing keystrokes.
    event.stopPropagation()
    if (event.key === 'Enter') {
      const value = input.value
      print(`${value}\n`) // the echo a tty would show
      inputs.push(value)
      void round()
    }
  })

  void round()
  return { element: root }
}

async function runCode(code: string, lang: Lang): Promise<CodeRunnerOutput> {
  try {
    const config = { ...DEFAULTS[lang], ...slideConfig(lang) }
    return runTerminal(code, lang, config)
  }
  catch (error) {
    return {
      text: error instanceof Error ? error.message : String(error),
      class: 'text-red',
    }
  }
}

export default defineCodeRunnersSetup((_runners: CodeRunnerProviders) => ({
  c: async (code: string, _ctx: CodeRunnerContext): Promise<CodeRunnerOutput> => runCode(code, 'c'),
  cpp: async (code: string, _ctx: CodeRunnerContext): Promise<CodeRunnerOutput> => runCode(code, 'cpp'),
}))
