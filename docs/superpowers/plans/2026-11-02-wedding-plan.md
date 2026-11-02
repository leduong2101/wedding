# Wedding invitation implementation plan

> For agentic workers: use executing-plans to implement this plan inline, task by task.

**Goal:** Build the approved traditional red wedding invitation, ready for GitHub Pages.
**Architecture:** Static semantic HTML, CSS, native JS modules; one data configuration, pure countdown logic, isolated music controller. Local original SVG illustrations and generated original melody avoid remote asset dependencies.
**Tech Stack:** HTML, CSS, JavaScript, Node 20 built-in test runner, Python local server, Playwright browser verification.
**Spec:** `docs/superpowers/specs/2026-11-02-wedding-design.md`

## Global constraints
- One reception, 17:00 on 29/11/2026 in Vietnam (`2026-11-29T17:00:00+07:00`).
- Red/gold, Vietnamese copy, real approved family information; illustrative artwork only until photos arrive.
- No invented accounts or QR codes, no backend, no publishing without permission.
- Relative local asset paths; mobile from 320px; keyboard support and reduced motion.
- Music starts only after opening; failure must not block the invitation.

## Review focus
- Countdown must use the event timezone, clamp at zero and refresh on return to tab.
- Audio rejection and rapid repeated toggles must not show false playing state.
- Cover must not hide content without JavaScript or trap keyboard focus after opening.
- Missing gift data must not produce fake QR or copy buttons; valid future gift data must render safely.
- Project subpaths, offline assets and narrow mobile screens must work without external dependencies.

## Task 1: Configuration and countdown
Files: `package.json`, `js/config.js`, `js/countdown.js`, `tests/countdown.test.js`.
Interfaces: `wedding` exports approved data; `getCountdown(target, now = Date.now())` returns `{days,hours,minutes,seconds,complete}`.
- [x] Write tests for the configured event's UTC instant, one day before, mixed units, event boundary and after-event values. Import absent modules dynamically so assertions name the missing behavior.
- [x] Run `npm test`, expect RED for absent countdown behavior.
- [x] Implement configuration and pure countdown; run `npm test`, expect all GREEN.

## Task 2: Invitation and music
Files: `index.html`, `styles.css`, `js/app.js`, `js/music.js`, `js/gifts.js`, `assets/*.svg`, `tests/music.test.js`, `tests/gifts.test.js`.
Interfaces: `createMusicController(source)` exposes `play()`, `pause()`, `isPlaying`; source supplies async `play()` and `pause()`. `getGiftDetails(gift)` returns validated display data or null. App consumes wedding, getCountdown, createMusicController and getGiftDetails.
- [x] Write tests for audio success, rejection, pause during pending play, failed pause; gift missing/incomplete/complete data and safe QR protocols. Run `npm test`, expect RED.
- [x] Implement controller and gift validation. Run `npm test`, expect GREEN.
- [x] Start local server and exercise browser checks against an absent page, expect missing invitation.
- [x] Implement mobile-first page, local artwork, cover, countdown, gallery dialog, original music and safe configurable gift display.
- [x] Run browser checks: approved copy, opening/music, toggle, dialog keyboard close, countdown, mobile no overflow, no-JS, reduced motion and subpath. Expect GREEN.

## Task 3: Deployment docs and final verification
Files: `README.md`, `.nojekyll`, `.gitignore`, `docs/superpowers/plans/wedding-progress.md`.
- [x] Document local server, tests, updating config/photos/audio/QR, GitHub Pages branch/root deployment and privacy.
- [x] Run `npm test` and fresh desktop/mobile browser checks; inspect screenshot and console/network errors.
- [x] Request one independent final review and address important findings with RED→GREEN regression tests. No important findings reported.
- [x] Update ledger and hand off local preview. Do not create a remote repository, commit, or publish.

## Environment adaptation
The workspace is not a Git repository. Work in the requested directory without initializing Git or creating worktrees. Git-based task/ledger scripts and commit steps cannot run; use this checklist and `wedding-progress.md` for evidence. User approved direct implementation after reviewing the spec; no further handoff pause is required.
