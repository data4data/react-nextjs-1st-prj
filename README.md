# Recreatiepark De Veluwse Hei

A one-page website for a Dutch recreation park, where **all content comes from a
CMS** instead of being written into the code.

An admin logs in, changes the text, the colors, the order of the sections, and
the public page changes. Visitors see only the website; they never see the CMS.

Built with Next.js 16 (App Router), Tailwind CSS v4 and shadcn/ui.

| | |
| --- | --- |
| Public website | `/` |
| Login | `/login` |
| CMS edit screen | `/dashboard` |

## Quick start

You need Node.js 20 or newer.

```bash
# 1. install the packages
npm install

# 2. create your local settings file
cp .env.example .env.local

# 3. put a real secret and your own login in .env.local (see below)

# 4. start the site
npm run dev
```

Then open **http://localhost:3000**.

> If port 3000 is taken, Next picks the next free port and prints it in the
> terminal. Use that number everywhere below.

### Filling in `.env.local`

`.env.local` is never committed, so your password stays on your machine.

```bash
# generate a random secret and paste it as AUTH_SECRET
openssl rand -hex 32
```

```env
AUTH_SECRET=<the long random string you just generated>
DEMO_EMAIL=admin@veluwsehei.nl
DEMO_PASSWORD=pick-your-own-password
```

`DEMO_EMAIL` and `DEMO_PASSWORD` are the one account that can open the CMS.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the site for development at http://localhost:3000 |
| `npm run build` | Build the production version. Fails on type errors. |
| `npm start` | Run the built production version (run `npm run build` first) |
| `npm run lint` | Check the code style |
| `npx tsc --noEmit` | Check the types without building |

## Testing it by hand

Work through this list once and you have seen every feature.

### 1. The public page

Open **http://localhost:3000**

- The slider at the top: drag it, or use the arrows (arrows appear from tablet
  size upward).
- The tabs under "Verblijf en voorzieningen": click each tab, the content
  changes without reloading the page.
- Make the window narrow (375px) and wide (1280px). The layout should stay
  readable at every size.

### 2. The contact modal

- Click **Neem contact op** in the top bar, or **Stuur een bericht** at the
  bottom of the page. The same modal opens from both places.
- Press **Verstuur bericht** with empty fields. You get a red message under
  each field and a red toast at the top.
- Type a wrong email such as `hello`. The error appears under that field only.
- Fill in a name, a real email and at least 10 characters of text, then send.
  The modal closes and a green toast appears.
- Check the result: a new file `data/messages.local.json` now exists with your
  message in it. That file is git-ignored on purpose.

### 3. Logging in

- Open **http://localhost:3000/dashboard** while logged out. You are sent to
  the login page. This is `proxy.ts` doing its job.
- Open **http://localhost:3000/login** and enter a wrong password. You get one
  general error, not "this email does not exist".
- Log in with the values from your `.env.local`. You land on the dashboard.

### 4. The CMS

On **http://localhost:3000/dashboard**:

- Change **Naam van de website** and press **Opslaan**. Open `/` in a second
  tab: the new name is in the header and in the browser tab title.
- Change the **primaire kleur** to something bright and save. Buttons, links
  and accents on the website all change. No component was edited.
- Click the **eye icon** on a section to hide it, and save. The section is gone
  from the website, but its text is still in the form: click the eye again and
  it comes back.
- Use the **arrows** to move a section up or down, and save. The order on the
  website follows, and the grey and white stripes stay alternating.
- In the tabs section, switch **Naast elkaar** / **Onder elkaar** and save. On a
  wide screen the tabs move to a column on the left.
- Press **Uitloggen**. You are back at the login page and `/dashboard` is closed
  again.

### 5. The error pages

- Open a page that does not exist, for example
  **http://localhost:3000/does-not-exist**. You get the styled 404 page.

## How it is put together

```
data/site.json          all the content. Edit it here or through the CMS.
   |
lib/cms/repository.ts   the only file that knows where the content is stored
   |
app/(site)/page.tsx     reads the content
   |
components/sections/    draws it
```

Folders in brackets, like `(site)`, group routes without showing up in the URL.

| Folder | What is inside |
| --- | --- |
| `app/(site)` | The public website |
| `app/(cms)` | Login and the edit screen |
| `app/actions` | Server actions: contact, save site, login |
| `components/sections` | One file per section type, plus the registry |
| `components/dashboard` | The edit forms |
| `components/ui` | shadcn components. Generated, so not hand-edited. |
| `lib/cms` | Types, validation and reading/writing the content |
| `lib/auth` | The signed session cookie |
| `proxy.ts` | Blocks `/dashboard` for visitors who are not logged in |

## Adding a new section type

Three files, and the page is never touched:

1. `lib/cms/schema.ts` — describe the new section.
2. `components/sections/your-section.tsx` — build it.
3. `components/sections/registry.ts` — add one line.

Add an edit form in `components/dashboard/section-forms.tsx` and the CMS can
edit it too. If you forget the registry line, TypeScript tells you.

## There is no database yet

The content lives in `data/site.json`. Every read and write goes through
`lib/cms/repository.ts`, and those functions are already `async` and shaped like
an API.

So adding a real backend later (Laravel + MySQL, or Prisma) only changes the
inside of those functions:

```ts
// now
const raw = await readFile(SITE_FILE, "utf8");

// later
const res = await fetch(`${process.env.API_URL}/site`);
```

Pages, sections and forms stay exactly as they are.

## Learning along the way

- [`docs/plan.md`](docs/plan.md) — what is built and why.
- [`docs/learning-plan.md`](docs/learning-plan.md) — short lessons on server and
  client components, events, server actions, validation, cookies and caching,
  each tied to a real file in this project.

The documentation for the exact installed Next.js version sits in
`node_modules/next/dist/docs/`. Use it instead of blog posts: several things
changed in Next 16, such as `middleware.ts` becoming `proxy.ts`.

## Good to know

- This is a demo login with one account from `.env.local`. A real product would
  use a library such as Auth.js or Clerk.
- Contact messages are written to `data/messages.local.json`, which is not
  committed. There is no email sending yet.
- Site copy is Dutch; code, file names and comments are English.
