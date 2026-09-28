# To do

What is finished is in [plan.md](plan.md). This file lists what is **not** done.

## Missing in the CMS

The edit screen can change text, colors, icons, order and visibility. It cannot
yet add or remove things. For now you add them in `data/sites/<name>.json` by
hand.

- [ ] Add and delete a whole website (today: copy a file in `data/sites/`).
- [ ] Add and delete sections (only hide and reorder work today).
- [ ] Add and delete slides in the slider.
- [ ] Add and delete tabs.
- [ ] Add and delete footer links.
- [ ] Drag and drop to change the order of cards in the admin, wherever a
      list of cards can be reordered: sections on the page, slider slides, tabs,
      and footer links.
- [ ] Upload images (the image is a path you type, such as `/hero-images/veluwe1.png`).
- [ ] See the received contact messages in the CMS.

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

These were out of scope. Each is its own feature branch.

- [ ] **NL / EN switch** for the admin chrome (the labels around the forms),
      not for the park copy. Site copy stays Dutch.
- [ ] **Real backend**: replace the JSON file with MySQL, through Laravel.
      Only the inside of `lib/cms/repository.ts` changes.
- [ ] **Monorepo**: Next.js front and Laravel API as two apps in one repo.
- [ ] **Containers**: Docker (and Compose) so a fresh machine can run the
      stack without a long local setup.
- [ ] **API permissions**: each park owner may only read and write their own
      site. The URLs are already per site (`/[site]`), but any logged-in user
      can edit any of them today.
- [ ] **Seeders**: demo content for a fresh database.
- [ ] **Real auth**: Auth.js or Clerk instead of the one demo account in
      `.env.local`.
- [ ] **Draft and published**: edit without the visitor seeing it right away.
- [ ] **Email**: send the contact message instead of only storing it.
- [ ] **Deploy**: the JSON file works locally, but a hosted server may have a
      read-only file system. This needs the database step first.
