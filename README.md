# Six Family Christmas 2026

A private family Christmas card, built with Laravel 13, Inertia 3, and React 19.
The admin panel uses Filament 5. The card, password gate, and event editor are not
implemented yet.

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
Filament/Livewire validation limits will need configuring when the panel is added.

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
`temporaryUploadUrl(...)`. Configure the future Filament upload field for the
`s3` disk and private visibility. Application authorization must control who can
request signed URLs. Do not make the bucket public to work around a preview issue.

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
