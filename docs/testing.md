# Testing it by hand

Work through this list once and you have seen every feature.

Start the site first:

```bash
npm run dev
```

The examples use port 3000. If that port is taken, Next picks the next free one
and prints it in the terminal. Use that number instead.

## 1. The public page

Open **http://localhost:3000**

- The slider at the top: drag it, or use the arrows (arrows appear from tablet
  size upward).
- The tabs under "Verblijf en voorzieningen": click each tab, the content
  changes without reloading the page.
- Make the window narrow (375px) and wide (1280px). The layout should stay
  readable at every size.

## 2. The contact modal

- Click **Neem contact op** in the top bar, or **Stuur een bericht** at the
  bottom of the page. The same modal opens from both places.
- Press **Verstuur bericht** with empty fields. You get a red message under
  each field and a red toast at the top.
- Type a wrong email such as `hello`. The error appears under that field only.
- Fill in a name, a real email and at least 10 characters of text, then send.
  The modal closes and a green toast appears.
- Check the result: a new file `data/messages.local.json` now exists with your
  message in it. That file is git-ignored on purpose.

## 3. Logging in

- Open **http://localhost:3000/dashboard** while logged out. You are sent to
  the login page. This is `proxy.ts` doing its job.
- Open **http://localhost:3000/login** and enter a wrong password. You get one
  general error, not "this email does not exist".
- Log in with the values from your `.env.local`. You land on the dashboard.

## 4. The CMS

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

## 5. The error pages

- Open a page that does not exist, for example
  **http://localhost:3000/does-not-exist**. You get the styled 404 page.

## Two experiments worth doing

These break something on purpose, so you can see which file catches it. Undo
each change afterwards.

**Where does the cache bite?**
Comment out `revalidatePath("/")` in `app/actions/site.ts`, change a title in
the dashboard and save. The website still shows the old title: the page was
saved but not rebuilt. Put the line back and the new title appears.

**Which error page appears?**
Add `throw new Error("test")` at the top of `app/(site)/page.tsx`. You get the
public error box with a retry button. Move the same line into
`app/(cms)/dashboard/page.tsx` and you get the CMS error box instead, while the
public website keeps working.
