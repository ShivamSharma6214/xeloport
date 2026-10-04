# Xeliport · Founder Command Center (prototype)

A rudimentary redesign prototype for the Xeliport dashboard, built to show Tesler's Law in practice:
the system and Xeliport's team absorb the complexity, and the brand founder only makes the decisions that are theirs.

All data is fictional (demo brand "Nilgiri Botanics"; UAE live, UK launching). Rules, rates and transit times are
illustrative assumptions. There is no backend, no database, no auth and no model.

**Start here:** `/#/proposal` is a one-page write-up of the whole proposal, with links into the prototype.

## What's in it

1. **Home** (`/#/`): the founder's three questions (on track to launch? stock ready to sell? money coming home?), the decisions that need them, and what Xeliport handled this week.
2. **Market** (`/#/market/uk`, `/#/market/uae`): the 90-day path for one market, plus the six service layers one level down.
3. **Decision** (`/#/decision/uk-claims`): priced options, a recommendation, "how Xeliport worked this out", what happens next, and what happens if you don't decide, including a WhatsApp reminder you can reply to.
4. **Xeliport team view** (`/#/ops`, or "Viewing as: Xeliport team" in the top bar): where the complexity went. Work held by the system, the team and partners, and the reminder ladder for each founder decision.
5. **Proposal** (`/#/proposal`): the write-up for reviewers.

**Demo controls** (bottom right, not part of the product): roll the Oct 9 UAE sailing and watch the system re-plan.
Decide the UAE Cyber Week stock first. If you added stock, one priced follow-up decision appears; if you skipped,
the event is absorbed and never reaches the founder. Also has **Reset demo**.

## Run

```bash
npm install
npm run dev
```

Keep Tailwind on v3 and Vite on v5 (as pinned in `package.json`). Don't run `npm audit fix --force`; it upgrades
them and breaks the build.

## Deploy (Vercel)

Build command `npm run build`, output directory `dist`. Routes use `#`, so no rewrites are needed.

The prototype runs on a fixed "today" (Oct 4, 2026) in `src/lib/dates.ts`, so every date on screen agrees.
