# Project rules

## Commits and git

- Short lowercase commit messages, a few words, no period. Example: `server vs client part of pages`.
- Never mention an AI, agent or assistant anywhere: not in commit messages, not as co-author, not in code comments, not in docs.
- `main` is stable. One branch per feature, small commits along the way, merged back with `--no-ff`.

## Layout

- Sections never set their own outer spacing or page background. `SectionShell` owns that, so any subset in any order still looks right.
- Mobile first. Check every section at 375px, 768px and 1280px, on its own, not only in the current order.
- Assume CMS text can be very short or very long, and that an image can be missing.

## Code

- App Router only. Server Components by default, `"use client"` only where events or state are needed.
- Page content comes from the CMS data layer in `lib/cms`, never hardcoded in components.
- Keep changes small and local: one concern lives in one place.
- New section types are added through `components/sections/registry.ts`. Never add a section by editing the page or with a `switch`.
- A component receives its data as props and does not fetch it itself, so it can be reused and moved.
- No new dependency unless there is no reasonable alternative.

## Content

- Site copy is Dutch, about a recreation park. Code, file names and comments are English.

## Explaining things

- Use simple English. Short sentences. No jargon without a plain-word meaning next to it.
- Introduce every new term with one small example taken from this project, so the word gets a picture attached to it.
- Prefer one concrete example over a long description.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
