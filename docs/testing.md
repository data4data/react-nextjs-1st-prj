# Testing it by hand

Work through this list once and you have seen every feature.

Start the site first:

```bash
npm run dev
```

The examples use port 3000. If that port is taken, Next picks the next free one
and prints it in the terminal. Use that number instead.

## 1. Two websites, one codebase

Open **http://localhost:3000**

You get a card per website. The two dots on each card are that park's primary
and secondary color.

- Open **De Veluwse Hei**. Green, a tree in the top bar, four sections.
- Go back and open **Zeeduin**. Blue, waves in the top bar, three sections, and
  the tabs stand in a column instead of a row.

Nothing about those two pages is duplicated in the code. Both come out of
`app/(site)/[site]/page.tsx`; only the JSON file behind them differs.

- Type a park that does not exist, for example
  **http://localhost:3000/duinhof**. You get the 404 page.

## 2. The public page

On either park:

- The slider at the top: drag it, or use the arrows (arrows appear from tablet
  size upward).
- The tabs: click each tab, the content changes without reloading the page.
- Notice the soft stripes behind every other section, and the footer. That
  colour is the **secondary color** from the CMS, washed out. Sand on the
  Veluwe, warm orange at Zeeduin.
- Make the window narrow (375px) and wide (1280px). The layout should stay
  readable at every size.

## 3. The contact modal

- Click the button in the top bar, or the one at the bottom of the page. The
  same modal opens from both places.
- Press **Verstuur bericht** with empty fields. You get a red message under
  each field and a red toast at the top.
- Type a wrong email such as `hello`. The error appears under that field only.
- Fill in a name, a real email and at least 10 characters of text, then send.
  The modal closes and a green toast appears.
- Check the result: a new file `data/messages.local.json` now exists. Each
  message has a `"site"` field, so a message from Zeeduin cannot be mistaken for
  one from the Veluwe. That file is git-ignored on purpose.
- Send one message from each park and compare the two `"site"` values.

## 4. Logging in

- Open **http://localhost:3000/veluwse-hei/settings** while logged out. You are
  sent to the login page, and the address bar now reads
  `/login?next=/veluwse-hei/settings`. This is `proxy.ts` remembering where you
  wanted to go.
- Enter a wrong password. You get one general error, not "this email does not
  exist".
- Log in with the values from your `.env.local`. You land back on the settings
  screen you originally asked for, not on some default page.

## 5. The CMS

On **http://localhost:3000/veluwse-hei/settings**:

- Change **Naam van de website** and press **Opslaan**. Open `/veluwse-hei` in a
  second tab: the new name is in the header and in the browser tab title.
- Under **Kleuren**, click one of the small colour squares for the **secundaire
  kleur** and save. The stripes behind the sections and the footer follow. No
  component was edited.
- Want a colour that is not in the row? Click the big square on the left. Your
  operating system's colour picker opens, and it has a field for an exact code
  if a brand colour was given to you as `#1f6f8b`.
- Do the same for the **primaire kleur**. Buttons, links and focus rings change,
  and so does the button inside the contact modal.
- Change **Icoon naast de naam** to the tent and save. The icon in the top bar
  changes. The CMS can only offer four icons, because the schema only allows
  four; it can never point at a picture that is missing.
- Click the **eye icon** on a section to hide it, and save. The section is gone
  from the website, but its text is still in the form: click the eye again and
  it comes back.
- Use the **arrows** to move a section up or down, and save. The order on the
  website follows, and the stripes stay alternating.
- In the tabs section, switch **Naast elkaar** / **Onder elkaar** and save.
- Open **/zeeduin** and check it did **not** change. Saving one park only
  rebuilds that park.
- On **/zeeduin/settings**, the "Het seizoen 2027" block is hidden on purpose.
  Switch it on and save to see it appear in the middle of the page.

## 6. The error pages

- Open a page that does not exist, for example
  **http://localhost:3000/does-not-exist**. You get the styled 404 page.

## Three experiments worth doing

These break something on purpose, so you can see which file catches it. Undo
each change afterwards.

**Where does the cache bite?**
Comment out `revalidatePath(...)` in `app/actions/site.ts`, change a title in
the settings screen and save. The website still shows the old title: the page
was saved but not rebuilt. Put the line back and the new title appears.

**Which error page appears?**
Add `throw new Error("test")` at the top of `app/(site)/[site]/page.tsx`. You
get the public error box with a retry button. Move the same line into
`app/(cms)/[site]/settings/page.tsx` and you get the CMS error box instead,
while the public website keeps working.

**Why does `loading.tsx` sit where it sits?**
Move `app/(site)/[site]/loading.tsx` one folder up, into `app/(site)/`. Build
with `npm run build && npx next start`, then ask for a park that does not exist
and look at the status code:

```bash
curl -o /dev/null -w "%{http_code}\n" http://localhost:3000/duinhof
```

It answers `200` instead of `404`. A loading file starts streaming the answer,
and the status code is sent the moment streaming begins, before the layout has
worked out that the park does not exist. Move the file back and it is `404`
again.
