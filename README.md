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

**Supabase is required.** Without env vars the public site shows empty states and War Room writes are disabled.

## Environment variables

Copy `.env.example` to `.env.local` and fill in values from your Supabase project dashboard (Settings → API):

| Variable | Where |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (server only — never expose to the browser) |
| `NEXT_PUBLIC_SITE_URL` | Production URL for share links |

On Vercel, add the same variables to the project environment settings.

## Local development

```bash
npm install
cp .env.example .env.local
# fill in Supabase keys
npm run dev
```

### Database setup

Migrations live in `supabase/migrations/`. Apply them to your hosted project via the Supabase SQL editor, `supabase db push`, or the Supabase MCP.

`supabase/seed.sql` is optional local fixture data only — production data is entered through War Room:

1. **Settings** — festival name, dates, live status
2. **Schools** — form or CSV (`code,name_en,name_ml,short_name`)
3. **Categories** → **Programmes** → **Stages** → **Schedule**
4. **Participants** — form or CSV (`school_code,full_name,full_name_ml,class_name,chest_number`)
5. **Results** — enter → verify → publish

### War Room users

Create staff in Supabase Auth. Profiles are auto-created via `handle_new_user`. Assign roles on the War Room **Users** page (super_admin) or set `raw_app_meta_data.role` before first login.

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
