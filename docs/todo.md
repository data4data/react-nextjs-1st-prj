# To do

What is finished is in [plan.md](plan.md). This file lists what is **not** done.

## Not tested by hand yet

The build, the types and the lint checks pass. The login gate, the section
order and the colors were checked from the command line. These need a real
browser and a few clicks:

- [ ] Send a message through the contact modal and see the green toast.
- [ ] Check that `data/messages.local.json` appears, with the right `"site"`.
- [ ] Press **Opslaan** in the settings screen and see the website change.
- [ ] Log in and out through the real form (not with a handmade cookie).
- [ ] Look at every section at 375px, 768px and 1280px, on **both** parks.

Steps for all of these are in [testing.md](testing.md).

## Missing in the CMS

The edit screen can change text, colors, icons, order and visibility. It cannot
yet add or remove things. For now you add them in `data/sites/<name>.json` by
hand.

- [ ] Add and delete a whole website (today: copy a file in `data/sites/`).
- [ ] Add and delete sections (only hide and reorder work today).
- [ ] Add and delete slides in the slider.
- [ ] Add and delete tabs.
- [ ] Add and delete footer links.
- [ ] Upload images (the image is a path you type, such as `/hero-images/hero1.png`).
- [ ] See the received contact messages in the CMS.
- [ ] A preview of the page before saving.

## Rough edges

- [ ] Saving writes the whole site at once. Two people editing at the same time
      would overwrite each other. Fine for one user, not for a real product.
- [ ] No confirmation when you leave the settings screen with unsaved changes.
- [ ] One login opens the settings of **every** park. A real product gives each
      customer an account that only reaches their own site.
- [ ] The received messages are all in one file. Nothing reads them back per
      site yet, even though each message stores which site it came from.
- [ ] `alt` text for images is not editable; the slider uses the slide title and
      the tabs use an empty `alt`.
- [ ] A colour is chosen, never typed. An exact brand code has to go through the
      operating system's picker. A paste field that only accepts `#rrggbb`, with
      its own error message, would be friendlier.
- [ ] The save action returns errors per field (`theme.primary`), but the
      settings screen only shows the general message in a toast. Nothing points
      at the field that is wrong.
- [ ] No tests. A first one could check that `getSite()` rejects a broken JSON
      file, and that it returns `null` for a slug with a `/` in it.

## Bigger steps, on purpose left for later

These were out of scope for this branch. Each is its own feature branch.

- [ ] **Real backend**: replace the JSON file with MySQL, through Laravel or
      Prisma. Only the inside of `lib/cms/repository.ts` changes.
- [ ] **Seeders**: demo content for a fresh database.
- [ ] **Real auth**: Auth.js or Clerk instead of the one demo account in
      `.env.local`.
- [ ] **Owners per tenant**: the URLs are already per site (`/[site]`), but any
      logged-in user can edit any of them.
- [ ] **Draft and published**: edit without the visitor seeing it right away.
- [ ] **Email**: send the contact message instead of only storing it.
- [ ] **Drag and drop** for the section order.
- [ ] **Deploy**: the JSON file works locally, but a hosted server may have a
      read-only file system. This needs the database step first.

## Housekeeping

- [ ] Turn off **Cursor Settings > Git & PRs > Attribution** so commits stay
      free of a co-author line. The local hook in `.git/hooks` does this too,
      but hooks are not committed, so they do not travel with the repo.
- [ ] Push the branch: `git push origin main`.
