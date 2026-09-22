# Recreatiepark De Veluwse Hei

A one-page website for a Dutch recreation park, where **all content comes from a
CMS** instead of being written into the code.

An admin logs in, changes the text, the colors, the order of the sections, and
the public page changes. Visitors see only the website; they never see the CMS.

Built with Next.js 16 (App Router), Tailwind CSS v4 and shadcn/ui.

| Page | URL |
| --- | --- |
| Public website | http://localhost:3000 |
| Login | http://localhost:3000/login |
| CMS edit screen | http://localhost:3000/dashboard |

## Quick start

You need Node.js 20 or newer.

```bash
npm install                # install the packages
cp .env.example .env.local # create your local settings file
npm run dev                # start the site
```

Then open **http://localhost:3000**.

> If port 3000 is taken, Next picks the next free port and prints it in the
> terminal. Use that number instead.

Before you can open the CMS, fill in `.env.local`. It is never committed, so
your password stays on your machine.

```bash
openssl rand -hex 32   # generate a secret and paste it as AUTH_SECRET
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

## Where things are

```
data/site.json          all the content. Edit it here or through the CMS.
   |
lib/cms/repository.ts   the only file that knows where the content is stored
   |
app/(site)/page.tsx     reads the content
   |
components/sections/    draws it
```

The full folder map, the content model and the recipe for adding a new section
type are in [`docs/plan.md`](docs/plan.md).

## Documentation

| File | What is in it |
| --- | --- |
| [`docs/testing.md`](docs/testing.md) | Click-by-click walkthrough of every feature |
| [`docs/plan.md`](docs/plan.md) | How it is built, folder map, adding a section |
| [`docs/learning-plan.md`](docs/learning-plan.md) | Short lessons tied to real files in this project |
| [`docs/todo.md`](docs/todo.md) | What is not done yet |

The documentation for the exact installed Next.js version sits in
`node_modules/next/dist/docs/`. Use it instead of blog posts: several things
changed in Next 16, such as `middleware.ts` becoming `proxy.ts`.

## Good to know

- There is no database. The content lives in `data/site.json`, behind async
  functions shaped like an API, so a real backend can replace them later.
- The login is a demo with one account from `.env.local`. A real product would
  use a library such as Auth.js or Clerk.
- Contact messages are written to `data/messages.local.json`, which is not
  committed. There is no email sending yet.
- Site copy is Dutch; code, file names and comments are English.
