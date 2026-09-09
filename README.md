# Kalolsavam Live

Official live platform for the **Sub-District Kerala School Kalolsavam** hosted at **MES HSS Irimbiliyam, Malappuram, Kerala**.

Two products in one Next.js app:

- **Public site** (`/`) — mobile-first live dashboard, results, schedule, reporting, media. No login.
- **War Room** (`/war-room`) — Little KITES operations: result entry → verification → publish, schedule, moderation, editorial.
- **Reporter** (`/reporter`) — phone-first live updates. Posts go public immediately.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, Storage, Realtime)
- Malayalam / English UI dictionaries in `src/lib/i18n/dictionaries.ts`

The app runs in **demo mode** when Supabase env vars are missing. Rankings are still computed from published results (`src/domains/results/scoring.ts`), never hardcoded.

## Local development (demo data, no backend)

```bash
npm install
npm run dev
```

Open http://localhost:3000

War Room demo login (also listed on `/war-room/login`):

| Email | Password | Role |
| --- | --- | --- |
| admin@kalolsavam.local | demo-admin | super_admin |
| operator@kalolsavam.local | demo-operator | results_operator |
| verifier@kalolsavam.local | demo-verifier | results_verifier |
| reporter@kalolsavam.local | demo-reporter | reporter |
| media@kalolsavam.local | demo-media | media_moderator |
| editor@kalolsavam.local | demo-editor | editor |
| photo@kalolsavam.local | demo-photo | photographer |

## Local Supabase

```bash
cp .env.example .env.local
npx supabase start
# copy API URL + anon key + service role into .env.local
npx supabase db reset   # applies supabase/migrations + supabase/seed.sql
npm run dev
```

Create War Room users in the Supabase Auth dashboard (or SQL). Roles live on `public.profiles` and are mirrored to `auth.users.raw_app_meta_data.role` (never `user_metadata`).

Hosted project: set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-only `SUPABASE_SERVICE_ROLE_KEY`. Run the migration in the SQL editor or `supabase db push`.

## Scoring

Configurable JSON on `event_settings.scoring_rules`:

```json
{
  "grade_points": { "A": 5, "B": 3, "C": 1 },
  "rank_points": { "1": 0, "2": 0, "3": 0 },
  "group_multiplier": 1,
  "grade_thresholds": { "A": 80, "B": 70, "C": 60 },
  "max_marks": 100
}
```

Only **published** result sets affect `school_standings`. Draft / entered / verified-unpublished do not.

Result workflow: `draft → entered → verified → published`. Published sheets are locked; corrections create a new version with an audit trail.

## Tests

```bash
npm test
```

## Public search

Schools, programmes, events, articles, live updates. Participant names appear on result pages but are **not** searchable and have no profile pages.
