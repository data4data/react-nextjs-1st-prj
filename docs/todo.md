# To do

What is finished is in [plan.md](plan.md). This file lists what is **not** done.

## Not tested by hand yet

The build, the types and the lint checks pass. The login gate, the section
order and the colors were checked from the command line. These need a real
browser and a few clicks:

- [ ] Send a message through the contact modal and see the green toast.
- [ ] Check that `data/messages.local.json` appears with your message in it.
- [ ] Press **Opslaan** in the dashboard and see the website change.
- [ ] Log in and out through the real form (not with a handmade cookie).
- [ ] Look at every section at 375px, 768px and 1280px.

Steps for all of these are in [testing.md](testing.md).

## Missing in the CMS

The edit screen can change text, colors, order and visibility. It cannot yet
add or remove things. For now you add them in `data/site.json` by hand.

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
- [ ] No confirmation when you leave the dashboard with unsaved changes.
- [ ] `alt` text for images is not editable; the slider uses the slide title and
      the tabs use an empty `alt`.
- [ ] No tests. A first one could check that `getSite()` rejects a broken
      `site.json`.

## Bigger steps, on purpose left for later

These were out of scope for this branch. Each is its own feature branch.

- [ ] **Real backend**: replace the JSON file with MySQL, through Laravel or
      Prisma. Only the inside of `lib/cms/repository.ts` changes.
- [ ] **Seeders**: demo content for a fresh database.
- [ ] **Real auth**: Auth.js or Clerk instead of the one demo account in
      `.env.local`.
- [ ] **Multi-tenant**: more than one site, each with its own URL
      (`app/s/[slug]/page.tsx`) and its own owner.
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
