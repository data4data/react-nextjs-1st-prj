#!/bin/sh
# Copy the tracked hooks into .git/hooks so Git runs them.
# This does not change git config.

set -e

root="$(git rev-parse --show-toplevel)"
git_dir="$(git rev-parse --git-dir)"
src="$root/githooks"

for hook in "$src"/*; do
  [ -f "$hook" ] || continue
  name="$(basename "$hook")"
  dest="$git_dir/hooks/$name"
  cp "$hook" "$dest"
  chmod +x "$dest"
done
