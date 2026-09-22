# Plan

## What this project is

A one-page website for a recreation park in the Netherlands.

The special part: the page is not written by hand. The header, the footer, the
colors and every section come from **CMS data**. A logged-in admin opens
`/dashboard`, changes the text, and the public page changes.

Two surfaces, one app:

| Surface | URL | Who uses it |
| --- | --- | --- |
| Public site | `/` | Visitors. No login. |
| CMS | `/login`, `/dashboard` | The park owner. Login needed. |

## Stack

- **Next.js 16** (App Router only, no `pages/` folder)
- **React 19** (stable, no canary or experimental tags)
- **Tailwind CSS v4** (configured in `app/globals.css`, no `tailwind.config`)
- **shadcn/ui** components in `components/ui/`
- **zod** for validation
- Data in a **JSON file** for now. No database yet.

## How data flows

```
data/site.json
  -> lib/cms/repository.ts    (async functions, shaped like a future API)
  -> app/(site)/page.tsx      (Server Component, reads the data)
  -> components/sections/*    (render it)

dashboard form
  -> saveSite server action   (checks login, validates, writes the JSON)
  -> revalidatePath("/")      (public page shows the new content)
```

## Why JSON and not MySQL

`lib/cms/repository.ts` is the only file that knows where the data lives.
Everything else just calls `getSite()` and gets an object back.

So when a real backend arrives (Laravel + MySQL, or Next + Prisma), only the
inside of those functions changes:

```ts
// now
const raw = await readFile(SITE_FILE, "utf8")

// later
const res = await fetch(`${process.env.API_URL}/site`)
```

The page, the sections and the dashboard stay exactly the same. That is the
whole point of putting the data behind functions.

## Folder map

```
app/
  layout.tsx            html, body, fonts, toaster. Nothing visual.
  not-found.tsx         404 page
  global-error.tsx      shown if the root layout itself crashes
  (site)/               public website
    layout.tsx          header + footer + theme colors
    page.tsx            the one-pager
    loading.tsx         skeleton while loading
    error.tsx           error box for the public page
  (cms)/                admin area
    layout.tsx          cms shell with sign out
    error.tsx           error box for the cms
    login/page.tsx      -> /login
    dashboard/page.tsx  -> /dashboard
  actions/              server actions (contact, site, auth)

components/
  sections/             one file per section type + registry + shell
  dashboard/            the edit forms
  ui/                   shadcn components. Do not hand-edit.
  site-header.tsx
  site-footer.tsx
  contact-modal.tsx
  error-state.tsx

lib/
  cms/                  types, zod schema, repository
  auth/                 cookie session

data/
  site.json             the content. Committed.
  messages.local.json   contact messages. Not committed.

proxy.ts                blocks /dashboard when not logged in
```

A folder in brackets, like `(site)`, does **not** appear in the URL. It only
groups routes so they can share a layout. `app/(site)/page.tsx` is still `/`.

## How to add a new section

Say you want a "gallery" section. Three files, and you never open `page.tsx`:

1. `lib/cms/types.ts` and `lib/cms/schema.ts` — add the shape of the new section.
2. `components/sections/gallery-section.tsx` — write the component.
3. `components/sections/registry.ts` — add one line: `gallery: GallerySection`.

Then add it to `data/site.json` (or from the dashboard). Done.

If you forget step 3, TypeScript shows an error. You cannot silently break the
page.

## Rules that keep the page beautiful

The admin decides which sections are shown and in which order. A section can be
hidden. So the page must look right with **any** mix.

- Sections never set their own outer spacing or background color.
  `SectionShell` does that, based on the position in the list that is actually
  rendered.
- Because the striped background is counted while rendering, hiding a section
  can never put two grey blocks next to each other.
- Text from the CMS can be one word or one hundred. Text wraps, it never
  overflows.
- Images have a fixed aspect ratio, so a tall photo cannot stretch the page.
- If all sections are hidden, the page shows the header, the footer and a calm
  message. Never an empty white screen.

## Auth in one paragraph

The browser cannot decide who is logged in. Only the server can.

Login form -> server action checks the email and password from `.env.local` ->
server sets an httpOnly cookie, signed with a secret -> `proxy.ts` checks that
cookie before letting anyone see `/dashboard` -> every server action checks it
again before saving, because a gate at the door is not enough.

This is a demo login with one user from the env file. For a real product you
would use a library such as Auth.js or Clerk.

## Git workflow

- `main` stays stable.
- One branch per feature: `feature/cms-one-page`.
- Small commits with short lowercase messages.
- Merge back with `--no-ff` so the feature stays visible in the history.

## Run it locally

```bash
cp .env.example .env.local   # then edit the values
npm install
npm run dev
```

Open `http://localhost:3000` for the site and `http://localhost:3000/login`
for the CMS.

## Not in this branch

Multi-tenant (many customers), MySQL, Laravel, seeders, drag and drop,
image uploads, draft versus published, billing.
