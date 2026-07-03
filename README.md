# California PE Civil — Exam Prep

A self-hosted, offline-capable study app for California civil PE licensure —
covering **both NCEES depth options** (choose your path later) plus the two
California-specific exams:

| Exam | Authority | Format |
|------|-----------|--------|
| **FE Civil (EIT)** | NCEES | 110 questions · 6-hour appointment |
| **PE Civil — Geotechnical depth** | NCEES | 80 questions · 9-hour appointment |
| **PE Civil — Water Resources & Environmental depth** | NCEES | 80 questions · 9-hour appointment |
| **CA Civil Seismic Principles** | BPELSG (Prometric) | 55 questions · 2.5 hours |
| **CA Civil Engineering Surveying** | BPELSG (Prometric) | 55 questions · 2.5 hours |

Specs verified June 2026 against the NCEES PE Civil–Geotechnical CBT
specification (effective April 2024) and the BPELSG/Prometric California test
plans. **Always re-confirm the live test plan and approved code editions on
[ncees.org](https://ncees.org/exams/pe-exam/civil/) and
[bpelsg.ca.gov](https://www.bpelsg.ca.gov/applicants/candidate_info.shtml)
before your exam date.**

## Features

- **Placement diagnostic** — a 12-question quiz on first launch that baselines your competency per exam and seeds the study plan.
- **MathLab** — a built-in calculation workspace: ~14 guided solvers (bearing capacity, consolidation, base shear, curve stationing, …) that show every step with your numbers, plus a free-form notebook worksheet with variables and degree-mode trig.
- **Review / cram mode** — an automatic error log of every question whose latest attempt was wrong, with one-tap cram sessions until each is corrected.
- **Dashboard** — readiness score per exam, weakest-area surfacing, study streak, exam-date countdown, study timer, and a "recommended for you" queue.
- **Study modules** — knowledge-area tree with mastery bars; lessons render real math (KaTeX), worked examples, exam-day tips, **interactive animations**, and curated video links. Rate your confidence per topic.
- **Interactive animations** — Mohr's circle, effective-stress profile, ASCE 7 design response spectrum / base shear, and horizontal-curve geometry. Drag the inputs and watch the results.
- **Practice** — build an untimed quiz filtered by exam/area, with instant explanations.
- **Mock exams** — CBT-style **timed** simulations that mirror each exam's blueprint weighting and per-question pacing, with a countdown timer, question navigator, flag-for-review, on-screen calculator, auto-submit, and a per-area score breakdown + answer review.
- **Flashcards** — SM-2 **spaced repetition** for key formulas.
- **Adaptive engine** — tracks accuracy, time-per-question, and confidence per topic with recency weighting, then recommends the highest-leverage next action and reports *how you learn* (your sharpest time of day, pace, and the measurable lift from studying first).
- **Progress** — readiness over time, 14-day activity, per-area mastery, and learning insights.
- **Reference** — formula sheet, allowed codes/standards per exam, and a unit cheat-sheet.
- **Settings** — export/import your progress as JSON to move between devices; reset.

All progress is stored in your browser (`localStorage`). No account, no server.

## Multiple users & cloud sync

- **Profiles** (Settings → Profiles): each person gets a fully separate progress
  store on the same device — create a profile per user and switch anytime.
- **Cloud sync** (Settings → Cloud sync): back up a profile's progress to a
  **private GitHub Gist** and load it on any other device (phone ↔ laptop).
  Use a personal access token with only the `gist` scope; it stays in the
  browser and is never included in exports.
- **Give someone their own copy**: fork or copy this repo to their GitHub
  account, enable Pages (Settings → Pages → Source: GitHub Actions), and the
  deploy workflow publishes automatically — the base path is derived from the
  repo name, so no code changes are needed.

## A note on questions

This app uses **original practice questions** written to mirror the real exams'
topics, weighting, difficulty, and reference standards. Actual NCEES and BPELSG
exam items are copyrighted and protected by a non-disclosure agreement — they
are never published, and no legitimate prep course uses them. The question bank
is designed to grow; see below.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Deploy to GitHub Pages

1. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the app
   and publishes `dist/` to Pages. It auto-derives the base path from the repo
   name (e.g. `/peexam/`).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Your app will be live at `https://<user>.github.io/<repo>/`.

If your repo name differs from the Pages path, set `VITE_BASE` when building.

## Adding / editing content

Everything is plain data — no app changes needed:

- **Lessons** → `src/data/lessons/{geotech,seismic,surveying}.ts`
- **Questions** → `src/data/questions.ts`
- **Flashcards** → `src/data/flashcards.ts`
- **Exam blueprints / weights** → `src/data/exams.ts`
- **New animations** → add a component under `src/components/animations/` and
  register it in `registry.tsx`, then reference it from a lesson `animation` block.

Math uses KaTeX: write `$...$` inline, or `<span class="tex">...</span>` inside
prose HTML, or the `tex` field on `formula`/`example` blocks.

## Tech

Vite · React · TypeScript · Tailwind CSS · Zustand (persisted) · KaTeX.
