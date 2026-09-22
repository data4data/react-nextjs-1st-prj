# Learning plan

The goal is not to finish fast. The goal is to understand what happens and why,
and to be able to change one thing without touching fifty files.

Every lesson has the same four parts:

1. **What it means** — one plain sentence.
2. **In this project** — a real file you can open.
3. **What breaks** — the mistake you will probably make once.
4. **Exercise** — a small change, and the question "which file?".

## Where to look things up

Do not trust blog posts about Next.js. They are often about an older version.

- The docs for **your exact version** are inside the project:
  `node_modules/next/dist/docs/`. Same structure as the website.
- When `next dev` prints an error, it also prints a `Learn more` link. Those
  pages exist to be read when something breaks. Read them.

Example of why this matters: most tutorials say the file that protects routes is
`middleware.ts`. In Next 16 it is `proxy.ts`. The bundled docs say so, the old
blog post does not.

---

## Lesson 1 — Server and client

**What it means.** A **Server Component** is built on the server and arrives in
the browser as finished HTML. It cannot listen to clicks. A **Client Component**
keeps living in the browser, so it can react to clicks and remember things.

**In this project.** `app/(site)/[site]/page.tsx` is a server component. It reads
the park content and returns HTML. `components/contact-modal.tsx` starts with
`"use client"` because it must open and close.

**What breaks.** Put `useState` in a server component and you get an error.
The component is already finished before it reaches the browser, so there is
nothing left to change.

**Rule of thumb.** If it must react to a click, it is a client part.

**Exercise.** Look at `components/sections/tabs-section.tsx`. Why does it need
`"use client"`, while `info-section.tsx` does not?

---

## Lesson 2 — Events and state

**What it means.** An **event** is something the user does: a click, typing.
**State** is a value the component remembers between renders.

**In this project.** The tabs section remembers which tab is open:

```tsx
const [active, setActive] = useState(items[0].label)
```

Clicking a tab calls `setActive`. React draws the component again with the new
value. You never touch the HTML yourself.

**What breaks.** Writing `active = "faciliteiten"` directly. The value changes
but nothing on screen updates, because React was not told.

**Exercise.** Add a fourth tab to `data/sites/veluwse-hei.json`. How many `.tsx`
files did you have to change?

---

## Lesson 3 — Props, and why components are easy to move

**What it means.** **Props** are the data a component receives from outside,
like arguments to a function.

**In this project.** `InfoSection` does not read any JSON file. It gets
`heading` and `body` as props. That is exactly why the same component draws both
parks without knowing that two parks exist.

**What breaks.** If a component fetches its own data, you cannot reuse it and
you cannot test it. It only works in one place.

**Exercise.** Where does `InfoSection` get its text from? Follow it backwards to
`data/sites/veluwse-hei.json`.

---

## Lesson 4 — The registry, or how to add a feature without pain

**What it means.** A **registry** is a lookup list: a name on the left, a
component on the right.

**In this project.** `components/sections/registry.ts` maps `"carousel"` to
`CarouselSection`. The page never asks "is this a carousel?". It looks the type
up and renders whatever it finds.

**What breaks.** The alternative is a long `if / else` inside the page. Then
every new section means editing the page, and the page slowly becomes a file
nobody dares to touch.

**Exercise.** Add a `"quote"` section: a type, a component, one line in the
registry. Notice that `page.tsx` stays untouched.

---

## Lesson 5 — Server Actions

**What it means.** A **Server Action** is a function that lives on the server
but can be called from a form, as if it were local.

**In this project.** `app/actions/contact.ts` starts with `"use server"`. The
contact modal passes it straight to the form:

```tsx
<form action={submitContact}>
```

No `fetch`, no URL, no JSON parsing. Next handles the network part.

**What breaks.** Forgetting that the action runs on the server. Anything you
write there (secrets, file paths) must never be sent to the browser.

**Exercise.** Add a `phone` field to the contact form. Which two files change?

---

## Lesson 6 — Validation with zod, and two kinds of feedback

**What it means.** **Validation** is checking that the data makes sense before
using it. Never trust the browser: someone can always send a broken request.

**In this project.** `submitContact` parses the form with a zod schema. If the
email is wrong, it returns errors instead of saving.

Two kinds of feedback, on purpose:

- **Inline error** next to the field: "vul een geldig e-mailadres in".
- **Toast** for the overall result: "bericht verzonden".

A toast that says "email is invalid" disappears before the user finds the field.
That is why both exist.

**Exercise.** Make the message field require at least 10 characters. Where?

---

## Lesson 7 — Cookies, proxy and who is logged in

**What it means.** A **cookie** is a small value the browser sends with every
request. An **httpOnly** cookie cannot be read by JavaScript, so it is safe for
a session.

**In this project.** `lib/auth/session.ts` signs a cookie with a secret.
`proxy.ts` checks it before `/veluwse-hei/settings` renders. `requireUser()`
checks it again inside the save action.

**Why twice?** The gate at the door stops a person browsing to the page. The
check inside stops someone sending a request straight to the action. Both are
needed.

**What breaks.** Trusting a value from the browser, like `localStorage.isAdmin`.
Anyone can set that.

**Exercise.** Log in, delete the cookie in devtools, then try to save. What
happens, and which file stopped you?

---

## Lesson 8 — Cache and revalidate

**What it means.** Next may keep a finished page and reuse it, so the next
visitor gets it fast. **Revalidate** means: this is old now, build it again.

**In this project.** After the settings screen saves, `saveSiteAction` calls
`revalidatePath("/veluwse-hei")`. Without that line, you save, open the site,
and see the old text, and it looks like the save failed.

Notice the path has the slug in it. Only the park you edited is rebuilt; the
other park's page stays as it was, and stays fast.

**What breaks.** Exactly that: a save that "does nothing". The data was written,
the page was just not rebuilt.

**Exercise.** Comment out the `revalidatePath` lines, save a new title, and open
the website. Then put them back.

---

## Lesson 9 — Theme colors with CSS variables

**What it means.** A **CSS variable** is a named color that the whole page can
use. Change the variable, and everything using it changes.

**In this project.** `app/globals.css` defines `--primary`. Tailwind classes
like `bg-primary` read it. `components/theme-provider.tsx` writes a new value in
a `:root` rule, so the admin can change the whole site color from one input.

The secondary color is used too: `--section-tint` mixes it with the page
background, and `SectionShell` paints every other section with it. One variable
built out of another, so the recipe lives in one place.

**Why `:root` and not a wrapper `<div>`?** A CSS variable is inherited by
children. The contact modal is not a child: it is rendered through a **portal**,
straight into `<body>`. On a wrapper it would miss the colors and fall back to
the defaults, which is how it once ended up pink on a green site.

**What breaks.** Hardcoding `bg-pink-500` in twenty components. Then a color
change means twenty edits.

**Exercise.** Change the secondary color in the settings screen. Count how many
files you had to edit. (Zero.) Then open the contact modal and check its button
followed the primary color.

---

## Lesson 10 — Error pages

**What it means.** An **error boundary** catches a crash and shows a fallback
instead of a white screen.

**In this project.** `app/(site)/error.tsx` catches crashes on the public page.
It is a client component, and it receives `retry` (in Next 16, not `reset` as
older tutorials show).

Errors thrown on the server arrive with a generic message and a `digest` id.
That is deliberate: real error text could leak private details to a visitor.

**Exercise.** Throw an error on purpose in `page.tsx`. Which file appears?
Then move the throw into the settings page. Which one appears now?

---

## Lesson 11 — Dynamic routes, or one page for many websites

**What it means.** A folder in square brackets is a **dynamic segment**: a piece
of the URL that changes. `app/(site)/[site]/page.tsx` answers `/veluwse-hei` and
`/zeeduin` with the same file. The value is handed to the page as `params`.

Round brackets do the opposite. `(site)` is a **route group**: it does not show
up in the URL at all, it only lets a set of routes share a layout.

**In this project.**

```tsx
const { site: slug } = await params   // "zeeduin"
const site = await getSite(slug)      // reads data/sites/zeeduin.json
if (!site) notFound()                 // 404 for a park that does not exist
```

`params` is a promise, so it is awaited. That is new in Next 15 and 16; older
tutorials read `params.site` directly.

**Why `notFound()`?** Without it, an unknown slug would render an empty page
with status 200, and Google would happily index it.

**What breaks.** Two things, both worth seeing once:

- Joining the slug into a file path without checking it. The slug comes from the
  visitor, so `..%2F..%2Fsecrets` would read a file outside `data/sites/`.
  `siteFile()` in the repository refuses anything that is not letters, digits
  and dashes.
- Putting `loading.tsx` one folder too high. It starts streaming the answer, the
  status code goes out as 200 before the layout notices the park is missing, and
  the 404 quietly stops being a 404.

**Exercise.** Copy `data/sites/zeeduin.json` to `data/sites/duinhof.json`, change
the `"slug"` inside to `"duinhof"`, and open `/duinhof`. Count the `.tsx` files
you changed. (Zero.)

---

## Suggested order

Follow the commits on the branch. Each commit is one small step:

1. route groups
2. cms data layer
3. error pages and toasts
4. header and footer
5. sections
6. contact modal
7. login
8. the settings screen
9. theme colors
10. two websites on one codebase

After each one, ask yourself the same question: **if I had to change this
tomorrow, which single file would I open?** If the answer is "five files", the
structure is wrong.
