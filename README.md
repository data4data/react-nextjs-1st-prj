# Recreatiepark CMS

One-page websites for Dutch recreation parks, where **all content comes from a
CMS** instead of being written into the code.

An admin logs in, changes the text, the colors, the order of the sections, and
the public page changes. Visitors see only the website; they never see the CMS.

There are **two example parks running on the same code**: a forest park and a
park by the sea. Everything that differs between them lives in one JSON file
each, so a third park is a third file and no new code.

Built with Next.js 16 (App Router), Tailwind CSS v4 and shadcn/ui.

| Page | URL |
| --- | --- |
| List of websites | http://localhost:3000 |
| De Veluwse Hei (forest) | http://localhost:3000/veluwse-hei |
| Zeeduin (sea) | http://localhost:3000/zeeduin |
| Settings for one site | http://localhost:3000/veluwse-hei/settings |
| Login | http://localhost:3000/login |

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
DEMO_EMAIL=admin@test.nl
DEMO_PASSWORD=admin
```

`DEMO_EMAIL` and `DEMO_PASSWORD` are the one account that can open the CMS.
They are deliberately easy to type for a local demo. Pick something real before
putting this anywhere other people can reach.

`AUTH_SECRET` is a different thing: it signs the session cookie. Keep it long
and random, or someone could make themselves a valid cookie without ever
knowing the password.

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
data/sites/zeeduin.json      all the content of one website
   |
lib/cms/repository.ts        the only file that knows where content is stored
   |
app/(site)/[site]/page.tsx   reads the content for the slug in the URL
   |
components/sections/         draws it
```

`[site]` in a folder name means that part of the URL changes: `/zeeduin` and
`/veluwse-hei` are the same file, rendered with different content.

The full folder map, the content model and the recipes for adding a website or
a new section type are in [`docs/plan.md`](docs/plan.md).

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

- There is no database. The content lives in `data/sites/*.json`, behind async
  functions shaped like an API, so a real backend can replace them later.
- The login is a demo with one account from `.env.local`. A real product would
  use a library such as Auth.js or Clerk.
- Contact messages are written to `data/messages.local.json`, which is not
  committed. There is no email sending yet.
- Site copy is Dutch; code, file names and comments are English.
