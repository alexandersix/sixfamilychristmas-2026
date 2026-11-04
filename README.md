# Six Family Christmas 2026

A private family Christmas card, built with Laravel 13, Inertia 3, and React 19.
The Filament 5 admin manages issues and reusable events. The family password gate
is not implemented yet; published issues are public.

## Admin panel

Open `/admin` on the application (or orb portal) to sign in. All authenticated
users can currently access the panel; there are no role or email restrictions.
Guests must still log in, and public registration is not enabled.

In the local development environment, run `php artisan db:seed` to create:

- Email: `test@example.com`
- Password: `password`

Orb setup runs this automatically. Repeated seeding preserves existing users and
their passwords. The development account is only seeded when `APP_ENV=local`,
never in production. Do not use these credentials for a deployed environment.

Filament assets are published automatically on `composer install` and updates via
the `filament:upgrade` Composer hook; no separate admin frontend build is needed.

## Editing an issue

1. Open **Issues → New issue** and enter a name, such as **2026**. Save it to
   create a draft with a generated address, such as `/issues/2026`.
2. On the issue's edit page, choose **Create new event** or **Add existing event**.
   An event has a short contents name, headline, optional introduction, story,
   and 1–4 photographs with required image descriptions and optional captions.
3. Use **Reorder** to change the events' reading order. Drag photos or use their
   arrow buttons to choose which photo leads each story. The existing example
   page's one-, two-, three-, and four-photo compositions are selected automatically;
   there is no incompatible layout option to choose accidentally.
4. Click **Preview** to see the saved issue. Draft previews require an admin login.
   Turn on **Publish issue** and save only when the issue is ready to be public.

The optional **Issue password** field sets or replaces a viewer password. It uses
Laravel's `hashed` cast (the same hashing configuration as user passwords), and
the hash is hidden from model serialization and never prefilled in the admin form.
Passwords follow the application's account password policy: at least 8 characters
locally; in production, at least 12 characters with mixed case, numbers, symbols,
and a breach check. A 72-byte maximum respects bcrypt's input limit even for
multibyte characters. Leave the field blank when editing to
preserve the current password. Existing issues keep a null password until one is
set; seeders do not create a shared default password.

**This only stores passwords; it does not enforce them yet. Published issues are
still publicly accessible until the viewer password check is implemented.**

The issue address stays the same after renaming it. Duplicate names receive a
suffix, such as `/issues/2026-2`. Empty issues are allowed while assembling a draft.
`/option-2`, `/styleguide`, and `/components` remain unchanged design references;
database-backed issues render at `/issues/{slug}` using the same chapter components.
Issue-level cover art, opening letters, and social-sharing metadata are not yet editable.

Events are a shared library: editing an event changes every issue that uses it,
including published issues. **Remove from issue** only detaches the event.
Deleting an issue preserves its events. An event can be deleted from the library
only after removal from every issue. Photos belong to the event; their ordered
paths, descriptions, and captions are stored together in its `photos` JSON column.
The `event_issue` join table stores each issue's independent event order and
prevents adding the same event twice to one issue.

Local `php artisan db:seed` also creates a draft **2026** issue with four sample
events showing every supported photo count, copying existing credited demo photos
into private S3 storage. Repeated seeding does not overwrite editorial changes.
Production seeding creates neither the demo content nor the development account.
`IssueFactory` and `EventFactory` support tests; factory photo paths are placeholders,
not uploaded files. Use storage fakes or supply real uploaded paths when rendering them.

## Hallmark design trial (Amp)

Hallmark is installed only for this project in
`.agents/skills/designing-with-hallmark/`. Amp discovers its `SKILL.md` directly;
no Claude Code plugin, hook, global install, or application dependency is needed
for the design instructions and static checks.

Ask Amp to **"Use Hallmark to design the Christmas card"** or
**"Use Hallmark to audit resources/js/pages/welcome.tsx without changing it"**.
Upstream `/hallmark` examples are not Amp slash commands. Hallmark can guide new
designs, but only applies to an existing design when explicitly requested.

The vendored copy is Hallmark 2.0.0 from
[Nutlope/hallmark](https://github.com/Nutlope/hallmark/tree/52328cb3129135499e4e178d4864ee90029dea2b/skills/hallmark)
at revision `52328cb3129135499e4e178d4864ee90029dea2b`, with its MIT license,
scripts, references, and theme pictures preserved. Local changes are the skill
name/frontmatter and the "Amp project trial" instructions in `SKILL.md`.
There are no automatic updates.

The static linter runs with Node 18 or later:

```sh
node .agents/skills/designing-with-hallmark/scripts/sloplint.mjs resources/js --scope app
```

Hallmark's own browser checks additionally require `puppeteer-core` (or
`puppeteer`) and Chrome. These are not added to the app's dependencies for this
trial. Set `HALLMARK_PUPPETEER` to a directory from which that package resolves
and `CHROME_PATH` if Chrome is outside the standard locations. With the app
running, pass `--render --url <dev-server-route>` to sloplint. Without these
prerequisites, only static checks run; that is not a browser-check pass.
Together image generation is optional and is not configured by this install.

To remove the trial, delete `.agents/skills/designing-with-hallmark/`, remove its
three `.gitignore` exception lines, the two Hallmark ignore patterns in
`vite.config.ts`, and this section, then reload Amp's skills (or start a new
thread). No application changes need undoing.

## Orb development environment

New orbs run the executable `.agents/setup` hook. It installs:

- PHP 8.4 and Composer, including PostgreSQL, SQLite (for tests), Intl, GD, EXIF,
  Fileinfo, Mbstring, XML, cURL, ZIP, and BCMath support. The locked Symfony and
  Pest dependencies require PHP 8.4 even though Laravel itself supports 8.3.
- PostgreSQL 15 with a `christmas` database and a non-superuser `christmas` role.
- SeaweedFS 4.52, a persistent S3-compatible object store with a private
  `christmas-photos` bucket.
- Nginx for a single-origin HTTPS preview of Laravel and S3.
- Composer and npm dependencies from their lockfiles, plus compiled React assets.
  Node.js and npm are supplied by the orb image.

Setup creates `.env` only when absent, generates development database and storage
credentials and an application key, and runs outstanding migrations. Re-running
it preserves existing credentials and data. These are **orb-only development
credentials**, not production secrets. Mail is written to the Laravel log.

To prepare an existing orb, run `.agents/setup`. To start or repair its services:

```sh
amp orb services ensure
```

Open the **Christmas Card** portal URL printed by that command, or use the Portal
tab. Portal access is controlled by Amp; it is not the future card password gate.
The preview uses compiled assets. After editing React or CSS, run `npm run build`
and reload the page. PHP edits are available on the next request.

Long-running services are declared in `.amp/services.yaml`: `web`, `laravel`,
`storage`, and `queue`. PostgreSQL is enabled through systemd. No resume hook is
needed: systemd and the orb service supervisor own the processes across restarts.

```sh
amp orb service list
amp orb service logs laravel
amp orb service restart queue
```

Restart the queue worker after changing jobs or their dependencies. It uses the
database queue, so Redis is not required. Database-backed sessions and cache are
also available. PHP accepts files up to 32 MiB and request bodies up to 140 MiB;
the event editor and Livewire limit each photo to 12 MiB.

## Photo storage

Laravel's default filesystem is `s3`, backed by `league/flysystem-aws-s3-v3`.
The `.env` file contains the local S3 endpoint, access credentials, region, and
bucket. SeaweedFS data lives under the ignored `storage/app/seaweedfs` directory.
PostgreSQL data lives in `/var/lib/postgresql`. Both survive service restarts and
orb sleep, but are not a backup and are not shared between independent orbs.

The Laravel and queue services override `APP_URL` and `AWS_ENDPOINT` with the
current portal origin at runtime. Nginx forwards `/christmas-photos` requests to
SeaweedFS without changing the URI or Host, preserving S3 signatures. Browser
uploads and signed image previews therefore use the same origin as the app,
without a separate storage portal or cross-origin authentication problems.

Keep photos private and use `Storage::disk('s3')->temporaryUrl(...)` for previews;
plain unsigned object URLs are denied. Direct browser uploads can use
`temporaryUploadUrl(...)`. The Filament photo fields use the `s3` disk, private
visibility, random filenames, and JPEG/PNG/WebP validation. Rich-text stories
support basic formatting and links; photographs are managed separately.
Issue responses sanitize story HTML and generate one-hour signed photo URLs only
after checking publication or preview access. Responses are not cacheable. Signed
URLs remain usable until they expire, even if an issue is subsequently unpublished.
Do not make the bucket public to work around a preview issue.

Removing or replacing a photo does not delete its storage object automatically.
This avoids destructive storage changes while editing shared stories; unused-file
cleanup and storage backups remain an operational responsibility.

## Checks

```sh
composer check-platform-reqs
npm run build
composer ci:check
```

Tests use in-memory SQLite by default; normal development uses PostgreSQL.
`composer ci:check` includes frontend formatting/linting, TypeScript, PHP
formatting, PHPStan, and Pest. Filament's PHP extensions and the Laravel S3 adapter
are available in the orb.
