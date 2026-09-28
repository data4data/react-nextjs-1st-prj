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
    layout.tsx            grey cms chrome (no park header)
    error.tsx             error box for the cms
    login/                -> /login
    [site]/layout.tsx     Beheer bar with the park name
    [site]/settings/      -> /zeeduin/settings
      layout.tsx          sidebar + save bar
      general/            name, description and colours together
      header/ footer/     koptekst and voettekst
      [sectionId]/        one page per content section
      colors/             old URL; redirects to general
  actions/                server actions (contact, site, auth)

components/
  sections/               one file per section type + registry + shell
    tabs/                 fotostrip and panels layouts for the tabs section
  settings/               the edit forms, sidebar, preview and save bar
  ui/                     shadcn components. Do not hand-edit.
  cms-header.tsx          Beheer bar (park name, Alle websites, Uitloggen)
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
githooks/                 commit checks, copied into .git/hooks on npm install
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
- A tab without a picture shows a quiet hatch, not a hole in the row.
- If all sections are hidden, the page shows the header, the footer and a calm
  message. Never an empty white screen.

`SectionRenderer` looks each section up in `components/sections/registry.ts`.
That registry is a client file (the section components listen to clicks), so
the renderer is a client component too. The page still only passes props; it
does not fetch.

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
- A commit is refused if the author, the committer or a `Co-authored-by` line
  names a tool. `npm install` copies `githooks/` into `.git/hooks`.

## Run it locally

```bash
cp .env.example .env.local   # then edit the values
npm install
npm run dev
```

Open `http://localhost:3000` for the list of websites, and
`http://localhost:3000/login` for the CMS.

## Settings in the CMS

The settings app has its own layout. A sidebar lists **Site** (Algemeen) and
**Pagina** (Koptekst, each content section, Voettekst). Each page has
**Voorbeeld** (how that part looks) and **Bewerken** (the form). Voorbeeld is
the tab that opens first.

Algemeen holds the park name, the description and both colours, so the preview
shows identity and theme together. The old `/settings/colors` URL still works:
it redirects there.

On each content section in the sidebar, arrows change the order and an eye
hides or shows the block on the public page. Hover explains the icons. Koptekst
and Voettekst stay put: they are always the top and the bottom of the page.

**Opslaan** sits in a bar at the bottom of the window. Changes are only live
after a save. **Bekijk website** opens the public park in a new tab.

Park colours stay on the public site and in the preview card. The CMS chrome
stays grey on purpose, so a bad colour pick never makes the screen where you
fix it unreadable.

## Not in this branch

MySQL, Laravel, a monorepo, Docker, seeders, an NL/EN switch for the admin
labels, drag and drop, image uploads, adding or deleting a website from the
CMS, draft versus published, per-customer API permissions, billing.
