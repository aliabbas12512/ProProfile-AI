# ProProfile AI

A professional profile website builder. Fill out a form, pick a template,
and export a complete personal website — no coding, no account, no cloud
database. It's a pure front-end app (no backend), so it works two ways:

- **Run it locally on Windows** (below) — fully offline after setup.
- **Deploy it to Vercel** (see "Deploy to GitHub + Vercel" further down) —
  gives anyone a public link where they can build their own profile in
  their browser, with zero setup on their end.

Both run the exact same code. Nothing here requires a server, a database,
or API keys — every profile is built and stored in the visitor's own
browser.

## Deploy to GitHub + Vercel (public website, no install for your users)

This turns the app into a live website anyone can open and use —
"open the link, fill the form, pick a template, download the profile" —
with no setup on their side. You only need GitHub and Vercel accounts
(both free).

**1. Push this project to GitHub**

```bash
cd proprofile-ai
git init
git add .
git commit -m "Initial commit"
```
Create a new empty repository on [github.com](https://github.com/new)
(don't initialize it with a README), then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

**2. Import it into Vercel**

1. Go to [vercel.com/new](https://vercel.com/new) and sign in (GitHub login is easiest).
2. Click **Import** next to the repository you just pushed.
3. Vercel auto-detects this as a **Vite** project — the defaults it fills in are already correct:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Environment Variables: none required.** Leave this section empty — the app has no backend and no API keys at all.
5. Click **Deploy**. After ~1 minute you'll get a live URL like `your-project.vercel.app`.

That's it — every visitor to that URL gets the full app: wizard, live preview, all 8 templates, HTML/ZIP/PDF export. Nothing to configure per-visitor.

**Updating the live site later:** commit and `git push` — Vercel redeploys automatically on every push to `main`.

### What this deployment does and doesn't do

- ✅ Anyone can open the link and build + download a profile — no login, no install.
- ✅ Fully responsive (desktop/tablet/mobile) at that public URL.
- ⚠️ **There is no shared database.** Each visitor's profiles live only in their own browser's storage — you (the site owner) cannot see or manage profiles people create. If you want a central dashboard of every profile created, or user accounts, or paid subscriptions, that's a separate, larger project (a real backend + database + auth + payment provider) — this deployment is the "free public tool" stage, not a SaaS-with-accounts stage yet.
- ⚠️ No analytics are wired in. To see how many people are using it, add Vercel Analytics (one click in the Vercel dashboard, no code change needed) or a privacy-friendly tool like Plausible.

## Running it on Windows

**First time only:**

1. Install [Node.js](https://nodejs.org) (LTS version) if you don't have it.
2. Unzip/copy this project folder anywhere on your computer.
3. Right-click inside the folder → "Open in Terminal" (or open PowerShell and `cd` into the folder).
4. Run:
   ```powershell
   .\install.ps1
   ```

**Every time you want to use it:**

```powershell
.\start.ps1
```

This opens `http://localhost:5173` in your browser. Leave the PowerShell
window open while you work — closing it stops the app. Press `Ctrl+C` in
that window to stop it manually.

> If PowerShell blocks the scripts with an "execution policy" error, run
> this once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### Building a permanent local copy (optional)

`npm run build` produces a `dist/` folder containing the built app. You can
open `dist/index.html` directly in a browser, or serve the `dist/` folder
with any static file server, without needing `npm run dev` or an internet
connection for the app itself.

## What works offline vs. what needs internet

| Feature | Needs internet? |
|---|---|
| Creating/editing a profile, all 8 templates, live preview | No |
| Saving projects locally, reopening them | No |
| JSON backup / import | No |
| Downloading the standalone HTML website | No |
| Downloading the website ZIP | No |
| Print / Save as PDF | No |
| **Opening the exported website later** (double-click the HTML file) | No |
| `npm install` (first-time setup) | **Yes**, one time |

## How the pieces fit together

- **React + TypeScript + Vite + Tailwind CSS** — the app itself.
- **IndexedDB** — where your projects are saved on this device. Nothing is
  uploaded anywhere.
- **8 templates, 4 shared layout engines** — Executive Professional and
  Corporate Business share a sidebar-photo layout; Modern Minimalist and
  Elegant Dark Theme share a centered-header layout; Technology & AI and
  Creative Portfolio share a dark hero-banner layout; Engineering &
  Construction and International Job Seeker share a timeline layout. Each
  pair looks genuinely different (colors, fonts, dark/light, decorative
  treatment) but shares the same content-rendering logic — this is a
  deliberate choice for consistency and reliability (one rendering bug
  fixed is fixed everywhere) rather than 8 fully independent
  implementations.
- **Standalone HTML export** — reads the already-compiled CSS straight out
  of the running app and inlines it, together with the rendered profile
  markup and any uploaded images (stored as base64), into one `.html`
  file. No build step runs at export time.

## Testing performed this session

Tested in this development environment (Linux container) using a
headless-browser test script that drove the actual running app — not just
code generation. All of the following passed:

- App starts and the dashboard loads
- Typing in the wizard updates the live preview immediately
- Adding and removing repeatable entries (experience, projects, etc.)
- Switching templates re-renders without errors
- A very long paragraph (stress test) wraps correctly without breaking the layout
- Downloading the standalone HTML, opening it via `file://` with no server running, and confirming it renders correctly offline with no external CDN references
- Downloading the website ZIP
- Exporting a project JSON backup and re-importing it as a new project
- Saving a project and reloading the editor — data persists via IndexedDB
- The dedicated print view renders correctly
- All 8 templates render in the gallery without errors
- A completely blank profile (no fields filled in) does not crash any template
- `npx tsc --noEmit` — zero TypeScript errors
- `npm run build` — production build succeeds

**One real bug was found and fixed during this testing pass**: on the three
darker/bolder templates, section headings were rendering in a color that
matched their own background (invisible text). Fixed by having headings
always use the theme's text color rather than its primary color.

**Second pass (preparing for public/Vercel deployment)**: added a proper
hero section and footer to the home page and gallery, a top-level error
boundary (so a bug in one visitor's data shows a recoverable screen
instead of a blank white page), and a catch-all route (unknown URLs
redirect to the home page instead of a blank screen). Re-ran `tsc
--noEmit`, `npm run build`, and the full 19-assertion workflow test suite
after these changes — all still pass.

### Known limitations — read this honestly

- **This was built and tested in a Linux cloud container, not on your actual
  Windows machine.** The dev server, production build, and every workflow
  above were verified to work in that environment. The PowerShell scripts
  are correct and standard, but running them on your specific Windows setup
  (antivirus, execution policy, a different Node version) is the one thing
  that could not be verified from here — if something doesn't match this
  README, that's the gap to look at first.
- **8 templates were delivered**, built on 4 distinct shared layout engines
  (see above) rather than 8 fully independent, bespoke implementations.
  This was a deliberate engineering tradeoff for consistency and lower bug
  surface, not a shortcut — but it's worth knowing if you expected 8
  completely unrelated designs.
- **Per-profession form fields are shared, not separate per profession.**
  Every profession uses the same wizard with the same section types;
  what changes per profession is the suggested skills/tools list. Building
  18 genuinely different field schemas was judged not worth the added
  complexity for the value it would add — the sections (education,
  experience, projects, certificates, etc.) already cover what every
  listed profession needs.
- **Drag-and-drop section reordering was not built.** Reordering uses
  up/down arrow buttons instead — functionally equivalent, less polished.
- The print/PDF output relies on the browser's own "Print to PDF" — quality
  depends on the browser used (Chrome/Edge produce the cleanest result).
- **Vercel deployment itself was not performed from here** — I don't have
  a GitHub/Vercel account in this environment to push to. What I verified
  instead: `npm run build` (the exact command Vercel runs) completes with
  no errors, and `vite preview` (which serves the built `dist/` output the
  same way a static host like Vercel does) passed the full test suite,
  including loading the site, routing, and every export flow. This is a
  strong signal the Vercel deploy will work — the build settings in the
  deployment steps above are Vercel's own standard Vite defaults — but the
  actual live deploy is the one thing to double check once you push it.

## Project structure

```
src/
  types.ts                  Core data model (ProfileData and friends)
  lib/                      Storage (IndexedDB), file handling, export logic
  templates/
    layouts/                 4 shared layout engines
    sectionContent.tsx        Shared rendering for each profile section
    registry.tsx               Maps 8 template IDs to a layout + theme
  components/                Wizard, live preview, design panel, export center
  pages/                      Home dashboard, template gallery, editor, print view
```
