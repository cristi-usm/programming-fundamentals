#!/bin/bash
# Suppress the printf format warnings slidev-addon-cpp-runner bakes into its
# compile command. The addon hardcodes COMMON_FLAGS and prepends them to the
# flags from the deck headmatter, so -Wno-format has to be patched in here —
# setting it in headmatter alone is not enough.
#
# Globbed rather than version-pinned: a version bump must not silently turn this
# into a no-op, so a missing file is reported loudly.

set -uo pipefail

found=0
for file in node_modules/.pnpm/slidev-addon-cpp-runner@*/node_modules/slidev-addon-cpp-runner/setup/code-runners.ts; do
    [ -f "$file" ] || continue
    found=1
    sed -i "s|const COMMON_FLAGS         = '-Wall -Wextra -pedantic -pthread -pedantic-errors';|const COMMON_FLAGS         = '-Wall -Wextra -pedantic -pthread -pedantic-errors -Wno-format -Wno-format-security -Wno-format-extra-args';|g" "$file"
    echo "✓ Patched cpp-runner flags in $file"
done

if [ "$found" -eq 0 ]; then
    echo "✗ slidev-addon-cpp-runner not found — compile warnings will be noisy" >&2
fi
