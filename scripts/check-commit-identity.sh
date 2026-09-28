#!/bin/sh
# Refuse a commit when the author or committer is a product name, not a person.

set -e

pattern='cursor|claude|chatgpt|openai|anthropic|copilot|gemini|grok|codegen|codex'

fail() {
  echo "Refuse this commit: the author or committer names a tool, not a person." >&2
  exit 1
}

check() {
  ident="$1"
  [ -n "$ident" ] || return 0
  if printf '%s\n' "$ident" | grep -Ei "$pattern" >/dev/null; then
    fail
  fi
}

check "$(git var GIT_AUTHOR_IDENT)"
check "$(git var GIT_COMMITTER_IDENT)"
exit 0
