# Plan

## What this project is

One-page websites for recreation parks in the Netherlands.

The special part: the pages are not written by hand. The header, the footer, the
colors and every section come from **CMS data**. A logged-in admin opens the
settings screen, changes the text, and the public page changes.

There are **two example parks**, running on exactly the same code. Everything
that differs between them sits in a JSON file. That is the point: a third park
is a third file, not a third codebase.

| Surface | URL | Who uses it |
| --- | --- | --- |
| List of websites | `/` | The front door of the demo |
| Public site | `/veluwse-hei`, `/zeeduin` | Visitors. No login. |
| Settings for one site | `/veluwse-hei/settings` | The park owner. Login needed. |
| Login | `/login` | |

The word for this is **multi-tenant**: one program serving several customers,
each with their own content. Here the tenant is the part of the URL that Next
calls `[site]`, so `/zeeduin` loads `data/sites/zeeduin.json`.

## Stack

- **Next.js 16** (App Router only, no `pages/` folder)
- **React 19** (stable, no canary or experimental tags)
- **Tailwind CSS v4** (configured in `app/globals.css`, no `tailwind.config`)
- **shadcn/ui** components in `components/ui/`
- **zod** for validation
- Data in a **JSON file** for now. No database yet.

## How data flows

```
data/sites/zeeduin.json
  -> lib/cms/repository.ts        (async functions, shaped like a future API)
  -> app/(site)/[site]/page.tsx   (Server Component, reads the data)
  -> components/sections/*        (render it)

settings form
  -> saveSite server action       (checks login, validates, writes the JSON)
  -> revalidatePath("/zeeduin")   (that one public page shows the new content)
```

The slug travels the whole way: it comes out of the URL, picks the file, and
goes back into `revalidatePath`, so saving one park never rebuilds the other.

## Why JSON and not MySQL

`lib/cms/repository.ts` is the only file that knows where the data lives.
Everything else just calls `getSite("zeeduin")` and gets an object back.

So when a real backend arrives (Laravel + MySQL, or Next + Prisma), only the
inside of those functions changes:

```ts
// now
const raw = await readFile(siteFile(slug), "utf8")

// later
const res = await fetch(`${process.env.API_URL}/sites/${slug}`)
```

The page, the sections and the edit forms stay exactly the same. That is the
whole point of putting the data behind functions.

## Folder map

```
app/
  layout.tsx              html, body, fonts, toaster. Nothing visual.
  page.tsx                -> /        the list of websites
  not-found.tsx           404 page
  global-error.tsx        shown if the root layout itself crashes
  (site)/                 public websites
    error.tsx             error box for the public page
    [site]/
      layout.tsx          header + footer + theme colors of one park
      page.tsx            -> /zeeduin        the one-pager
      loading.tsx         skeleton while loading
  (cms)/                  admin area
    layout.tsx            cms shell with sign out
    error.tsx             error box for the cms
    login/page.tsx        -> /login
    [site]/settings/      -> /zeeduin/settings
  actions/                server actions (contact, site, auth)

components/
  sections/               one file per section type + registry + shell
  settings/               the edit forms
  ui/                     shadcn components. Do not hand-edit.
  site-header.tsx
  site-footer.tsx
  contact-modal.tsx
  error-state.tsx

lib/
  cms/                    types, zod schema, repository
  auth/                   cookie session

data/
  sites/veluwse-hei.json  one website. Committed.
  sites/zeeduin.json      the other website. Committed.
  messages.local.json     contact messages. Not committed.

proxy.ts                  blocks /<site>/settings when not logged in
```

Two kinds of brackets, and they do opposite things:

- A folder in round brackets, like `(site)`, does **not** appear in the URL. It
  only groups routes so they can share a layout.
- A folder in square brackets, like `[site]`, **is** a piece of the URL that
  changes. `/zeeduin` and `/veluwse-hei` are the same file, rendered twice.

So `app/(site)/[site]/page.tsx` is the URL `/zeeduin`: the `(site)` part is
invisible, the `[site]` part is the slug.

## How to add a new website

1. Copy a file in `data/sites/` to `data/sites/duinhof.json`.
2. Change `"slug"` inside it to `"duinhof"`, so it matches the file name.
3. Change the title, the colors and the texts.

It appears on `/` and on `/duinhof` at once. No code is touched.

## How to add a new section

Say you want a "gallery" section. Three files, and you never open `page.tsx`:

1. `lib/cms/types.ts` and `lib/cms/schema.ts` — add the shape of the new section.
2. `components/sections/gallery-section.tsx` — write the component.
3. `components/sections/registry.ts` — add one line: `gallery: GallerySection`.

Then add it to a file in `data/sites/` (or from the settings screen). Done.

If you forget step 3, TypeScript shows an error. You cannot silently break the
page.

## Rules that keep the page beautiful

The admin decides which sections are shown and in which order. A section can be
hidden. So the page must look right with **any** mix.

- Sections never set their own outer spacing or background color.
  `SectionShell` does that, based on the position in the list that is actually
  rendered.
- Because the striped background is counted while rendering, hiding a section
  can never put two tinted blocks next to each other.
- The stripe is the **secondary color** washed out against the page, mixed in
  CSS with `color-mix`. So the second color from the CMS is visible, and it
  stays soft whatever color is picked.
- Text from the CMS can be one word or one hundred. Text wraps, it never
  overflows.
- Images have a fixed aspect ratio, so a tall photo cannot stretch the page.
- If all sections are hidden, the page shows the header, the footer and a calm
  message. Never an empty white screen.

## Auth in one paragraph

The browser cannot decide who is logged in. Only the server can.

Login form -> server action checks the email and password from `.env.local` ->
server sets an httpOnly cookie, signed with a secret -> `proxy.ts` checks that
cookie before letting anyone see a settings screen, and remembers where they
were going in `?next=` -> every server action checks it again before saving,
because a gate at the door is not enough.

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

Open `http://localhost:3000` for the list of websites, and
`http://localhost:3000/login` for the CMS.

## Not in this branch

MySQL, Laravel, seeders, drag and drop, image uploads, adding or deleting a
website from the CMS, draft versus published, per-customer accounts, billing.
