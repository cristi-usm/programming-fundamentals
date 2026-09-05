---
name: cpp-runner
description: Run C and C++ code inside a slide with slidev-addon-cpp-runner — the Coliru compile backend, the c/cpp frontmatter config (compiler, standard, optimization, flags, libraries, extraCommands, alwaysShowCompilerOutput, stdin), supported compiler/standard combinations, output prefixes, and the per-slide vs deck-wide config trap. Use when a slide has a runnable C or C++ block, needs scanf input, or the compile flags need changing.
---

# slidev-addon-cpp-runner

## ⭐ This repository overrides the addon's runners

`common/setup/code-runners.ts` (re-exported by each deck's `setup/code-runners.ts`)
replaces the addon's `c`/`cpp` runners. The output area is a **faithful local-terminal
simulation** — nothing appears that would not appear in a local run:

```
$ gcc program.c -o program
$ ./program
Introduceti doua note: 9 8
Media este 8.50
$
```

No prefixes, no banners. Diagnostics say `program.c` (renamed from Coliru's `main.cpp`).
When the program blocks on stdin, a borderless inline input sits exactly where the
local cursor would — a prompt printed without `\n` keeps the caret **on the same
line**, because what is shown is the program's real output up to the moment it blocked.
A click anywhere in the terminal block refocuses that caret (unless text is selected,
so copying output still works) and the block shows a text cursor while it waits. The
field is only ~2ch wide and borderless: without that, one stray click leaves the
presenter with nothing to aim at and the program apparently frozen.

Typed input is echoed like a tty and the session continues; multiple reads = multiple
waits, each answered separately. Keystrokes don't leak into slide navigation.

**How it works** (and its limits): Coliru is one-shot, so every interaction re-runs the
program with all input collected so far, under `timeout 2` with `stdbuf -o0` and stdin
held open — a program needing more input blocks and is killed (exit 124 = "waiting"),
and only the not-yet-shown output tail is displayed. Consequences: one Coliru round
trip (~5s) per input line; programs must be **deterministic** (a replay must print the
same prefix — no `rand()`/time-dependent output before reads); a clean program that
legitimately runs longer than ~2s reads as "waiting". No source-detection heuristics —
whether it waits is decided by actual runtime behaviour.

**Pre-fed input** — line N answers the Nth wait, no typing needed:

```yaml
---
layout: top-title
c:
  stdin: '9 8'        # multi-line: one line per read/wait
---
```

Input travels as a quoted heredoc (no escaping — only a literal `__FP_STDIN__` line
breaks it). Like all runner config, `stdin` is read from the **current slide's**
frontmatter (see the config-scope trap below). `alwaysShowCompilerOutput` is ignored —
diagnostics always show, like a local `gcc` would.

⚠️ The addon must stay **out** of the headmatter `addons:` list (sync-headmatter no
longer emits it) — both register a `c` runner and the addon's can shadow ours. The
package stays installed; `fix-cpp-runner.sh` still patches it but no longer affects
behaviour — our defaults already carry the `-Wno-format*` and `-Wno-unused-result`
flags.

Everything below documents the addon itself, and still applies to our override unless
said otherwise (we support only `g++`; other compilers fall back to it).

# slidev-addon-cpp-runner (upstream behaviour)

Adds `c` and `cpp` code runners to Slidev's Monaco runner, so ```` ```c {monaco-run} ````
gets a Run button.

```yaml
---
addons:
  - slidev-addon-cpp-runner
---
```

````md
```c {monaco-run}
#include <stdio.h>

int main(void) {
    printf("Salut!\n");
    return 0;
}
```
````

## It compiles remotely, not in the browser

The addon POSTs your source and a shell command to **Coliru**
(`https://coliru.stacked-crooked.com/compile`) and prints the response. Consequences worth
planning around:

- **A live network connection is required at presentation time.** No connectivity, no
  output — the Run button fails rather than degrading. Never let a runnable block carry the
  weight of a point you must land; keep the expected output visible or on the next slide.
- **Latency is a round trip**, not a local compile. Expect a visible pause.
- It is a free public service with no uptime guarantee, and every run sends your snippet to
  a third party. Fine for teaching examples, not for anything confidential.
- `slidev export` produces static output — runnable blocks become plain code in the PDF.

The addon config in `package.json` holds the endpoint (`config.coliru.compileUrl` and
`shareUrl`); it is not a documented frontmatter option.

## Configuration

Two independent blocks, `c:` and `cpp:`, each merged over the addon's defaults:

```yaml
c:
  compiler: 'gcc'
  standard: 'c2x'
  optimization: 'O2'
  flags: '-Wall -Wextra -pedantic -pthread -pedantic-errors'
  libraries: '-lm -latomic'
  extraCommands: ''
  alwaysShowCompilerOutput: true

cpp:
  compiler: 'g++'
  standard: 'c++20'
  optimization: 'O2'
  flags: '-Wall -Wextra -pedantic -pthread -pedantic-errors'
  libraries: '-lm -latomic'
  extraCommands: ''
  alwaysShowCompilerOutput: false
```

| Key | Notes |
|---|---|
| `compiler` | validated against the table below; an unsupported value logs a warning and falls back |
| `standard` | validated against the chosen compiler; falls back to `c2x` / `c++20` |
| `optimization` | `O0`, `O1`, `O2` (default), `O3`, `Os`, `Og`, `Ofast` |
| `flags` | **replaces** the built-in flag list entirely — it is not appended to |
| `libraries` | linked libraries; `-latomic` is added automatically for the standards that need it |
| `extraCommands` | shell appended after `;` — runs after the program |
| `alwaysShowCompilerOutput` | show compiler diagnostics even on success |
| `useStdLib` | `clang++` only — adds `-stdlib=libc++` |

### Supported combinations

| Language | Compiler | Standards |
|---|---|---|
| C | `g++` | `c89`, `c99`, `c11`, `c17`, `c2x` |
| C | `gcc-4.9`, `g++-4.9`, `g++-5.2` | `c89`, `c99`, `c11` |
| C | `clang` | `c89` |
| C | `clang++` | `c99`, `c11` |
| C++ | `g++` | `c++98`, `c++11`, `c++14`, `c++17`, `c++20`, `c++23` |
| C++ | `g++-5.2` | `c++98`, `c++11`, `c++14`, `c++1z` |
| C++ | `g++-4.9` | `c++98`, `c++11`, `c++14` |
| C++ | `clang++` | `c++98`, `c++11`, `c++14`, `c++17` |

Note `gcc` is accepted as a C compiler name but the internal fallback compiler for **both**
languages is `g++`; C sources are compiled with an explicit `-x c`. The source file is
always named `main.cpp` regardless of language, which matters only if `extraCommands`
references it.

### Output prefixes

With `alwaysShowCompilerOutput: true`, the command becomes
`… 2>&1 | sed "s/^/☘ /"; if [ -x a.out ]; then ./a.out | sed "s/^/☢ /"; fi` — so **☘ marks
compiler output and ☢ marks program output**. With it false, the command is `… && ./a.out`
and only the program's output appears (and nothing at all if compilation failed).

C defaults to `true`, C++ to `false`. For teaching, `true` is usually right: a student who
sees only silence when their code fails to compile learns nothing.

## ⚠️ Config in the headmatter applies to slide 1 only

The runner reads its config from **the current slide's frontmatter**
(`slide.meta.slide.frontmatter.c` / `.cpp`). In Slidev the headmatter *is* slide 1's
frontmatter — so `c:` / `cpp:` written there configures the first slide and nothing else.
Every later slide falls back to the addon's compiled-in defaults.

To apply a setting deck-wide, put it under `defaults:`, which Slidev merges into every
slide's frontmatter:

```yaml
---
defaults:
  c:
    standard: 'c2x'
    flags: '-Wall -Wextra -Wno-format'
---
```

Or repeat the block in the frontmatter of each slide that has a runnable block, which is
also how you override one slide (`standard: 'c89'` to demonstrate an older dialect).

This is the likely explanation for a symptom that otherwise looks like a bug: flags set in
the headmatter appear to be ignored on every slide but the first. If you hit it, test
`defaults:` before patching the addon.

## Patching the addon's defaults

Because `flags` replaces rather than extends the built-in list, and because of the
slide-scope issue above, some projects patch the addon's own `COMMON_FLAGS` after install
instead. In this repository that is `fix-cpp-runner.sh`, run from `postinstall`, adding
`-Wno-format -Wno-format-security -Wno-format-extra-args`.

If you touch that script: it globs the pnpm store path rather than pinning a version, and
reports loudly when it matches nothing — a silent no-op after a version bump would bring
the warnings back without anyone noticing.

## Writing examples that behave

- Complete programs only — `#include`, `main`, `return 0`. Students copy them verbatim.
- Compile clean. The default flags are `-Wall -Wextra -pedantic -pedantic-errors`, so
  sloppy examples fail outright rather than merely warning.
- Keep them short. The editor competes with the slide for space, and every run is a network
  round trip.
- Runnable blocks load Monaco and are heavy — a handful per deck, not one per example. Use
  plain ` ```c ` blocks for syntax, comparisons, and fragments.

## Related

`slide-code-blocks` covers the `{monaco-run}` options this addon plugs into —
`{autorun:false}`, `{showOutputAt:'+1'}`, `{height:'auto'}`.

Upstream: <https://github.com/SOHNE/slidev-addon-cpp-runner>
