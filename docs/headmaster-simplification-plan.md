# Kalolsavam Live — Simplification Plan (v2)

**For:** Headmaster approval · MES HSS Irimbiliyam  
**Prepared:** 9 September 2026  
**Status:** Proposal (not yet built)

---

## 1. Executive summary

Kalolsavam Live is a **public website** (results, schedule, photos, videos, what’s happening now) plus **staff logins** for students and teachers running the festival.

The current system has **too many role types** and features we don’t need — especially **text “live reports”** from scouts. In practice:

- **Scout / JRC** tell the **War Room** what’s happening → War Room updates **event status** (live, completed, delayed) on the schedule.
- **Live Media team** posts **video / live coverage** to the site (not text tweets).
- **Gallery Media team** uploads **photos and videos** to the gallery (and handles public submissions).

**Proposal:** **4 staff roles + public** — Admin, War Room, Live Media, Gallery Media. Results use **enter → review & confirm** (no separate verifier). No text live-report login.

---

## 2. What we remove

| Removed | Why |
|---------|-----|
| Text live reports (`/reporter`, live ticker posts) | Scout/JRC pass info to War Room verbally — not posted as text on the site |
| Results verifier role | Same War Room student reviews & confirms before publish |
| Editor, photographer, media_moderator, reporter roles | Replaced by two clear media teams |
| News articles & winner interviews (Phase 1) | Not needed for festival week |

---

## 3. The four logins

| Role | Team | Who | Suggested accounts | Responsibility |
|------|------|-----|-------------------|----------------|
| **Admin** | Teachers | Festival coordinator, ICT teacher | **2** | Festival setup, schools, schedule, categories, programmes, stages, create all staff logins, full audit log |
| **War Room** | Little KITES | Results desk students | **4–6** | Enter results → review & confirm → publish; update **event status** on schedule when Scout/JRC report (live / completed / delayed) |
| **Live Media** | Media team A | Students covering live video | **2–3** | Upload/post **live media reports** (short videos, clips, links) — what’s happening on stage **now** |
| **Gallery Media** | Media team B | Photo/video desk | **2–3** | Upload **photos and videos** to the gallery; approve/reject **public submissions** from visitors |

**Public:** No login. View everything published. Can submit photos/videos (goes to Gallery Media queue).

**Suggested total: ~12 accounts** (2 + 6 + 3 + 3) — four clear teams, not seven overlapping roles.

---

## 4. How information flows (Scout/JRC → website)

```
  Scout / JRC (on the ground, no login)
           │
           │  tells War Room verbally / on paper
           ▼
  ┌─────────────────────┐
  │      WAR ROOM       │
  │  Updates schedule:  │
  │  · LIVE             │
  │  · COMPLETED        │
  │  · DELAYED          │
  └──────────┬──────────┘
             │
             ▼
  Public site "Now happening" + schedule show correct status

  (No text posts from scouts on the website.)
```

War Room does **not** write news-style reports. They only update **official schedule status** and **results**.

---

## 5. Result workflow (War Room)

### No verifier — mandatory confirm step

```
Step 1 — ENTER
  War Room student enters marks from official sheet
  Saved as Draft (not public)

Step 2 — REVIEW & CONFIRM
  Same or another War Room student opens "Pending confirmation"
  Read-only summary of the full sheet
  Tick: "Checked against official paper"
  Click "Confirm & publish"

Step 3 — LIVE
  On public results + school points table
  Audit log: who entered, who confirmed, when
```

Corrections: unpublish → edit → confirm again. Full audit trail.

---

## 6. Live Media workflow (Media Team A)

**Purpose:** Show the festival as it happens — video coverage, not text.

```
Live Media student logs in
        ↓
Upload short video / clip OR paste video link (YouTube, etc.)
Add caption + stage / event (optional)
        ↓
Publish to "Live" section on public site
        ↓
Appears on home page + /live page
```

- **No approval queue** for Live Media (trusted team) — or optional Admin preview if sir prefers.
- Audit log records every post and who uploaded it.

**Public sees:** Video/media feed of what’s happening — not a text ticker from scouts.

---

## 7. Gallery Media workflow (Media Team B)

**Purpose:** Photo and video gallery for the festival.

### A) Staff uploads
```
Gallery Media logs in → Upload photo or video → Add caption → Publish to gallery
```

### B) Public submissions (optional)
```
Visitor → /submit → uploads photo/video
        ↓
   Pending (not on site)
        ↓
Gallery Media → Approve or Reject
        ↓
   Approved → /photos and /videos
```

War Room does **not** handle media — only Gallery Media team.

---

## 8. What each team sees (menus)

### Admin
- Dashboard  
- Settings · Schools · Participants · Categories · Programmes · Stages · Schedule  
- Users (create accounts for all teams)  
- Audit log  

### War Room
- Dashboard (pending results to confirm, today’s schedule)  
- **Results** (enter + confirmation queue)  
- **Schedule** (update status: upcoming → live → completed / delayed)  

### Live Media
- Dashboard  
- **Live coverage** (upload video / post live media report)  
- My recent posts  

### Gallery Media
- Dashboard  
- **Gallery** (upload photos & videos)  
- **Public submissions** (approve / reject queue)  

---

## 9. Public website (what visitors see)

| Section | Source |
|---------|--------|
| Results & points table | War Room (confirmed) |
| Schedule & “now happening” status | War Room (from Scout/JRC info) |
| Live coverage (video) | Live Media team |
| Photos & videos gallery | Gallery Media team (+ approved public uploads) |
| Submit your photo/video | → Gallery Media queue |
| Schools, programmes, search | Admin setup |

**Removed from public site:** Text live-report ticker from reporters.

---

## 10. Accountability (audit log)

| Action | Team | Logged |
|--------|------|--------|
| Result draft saved | War Room | ✓ |
| Result confirmed & published | War Room | ✓ |
| Schedule status changed (live/completed) | War Room | ✓ |
| Live media posted / removed | Live Media | ✓ |
| Gallery upload published | Gallery Media | ✓ |
| Public submission approved/rejected | Gallery Media | ✓ |
| Admin catalog or settings change | Admin | ✓ |

Admin sees full log. Each team sees their own work (optional).

---

## 11. What we postpone (Phase 2)

- News articles  
- Winner interview pages  
- Appeal tracking on results  
- Official PDF scan upload per result sheet  

---

## 12. Training plan (~1 hour, by team)

| Team | Time | Practice |
|------|------|----------|
| Admin | 15 min | Load schools, build schedule, create logins |
| War Room | 15 min | Enter result → confirm; mark one event “live” then “completed” |
| Live Media | 10 min | Upload one test video to live section |
| Gallery Media | 10 min | Upload one photo; approve one public test submission |
| All together | 10 min | Refresh public site; check audit log |

---

## 13. Implementation phases

### Phase A — Headmaster approval (tomorrow)
Sign off on: 4 roles, no text live reports, War Room = results + schedule status, two media teams.

### Phase B — Build (after approval)
- Replace 7 roles with 4 in database and UI  
- Remove `/reporter` and text live-feed from public site  
- Add Live Media upload console  
- Split Gallery Media upload + public moderation  
- War Room: results confirm flow + schedule status only  
- Audit log for all teams  

### Phase C — Festival eve
- Admin loads real data  
- 30-minute dry run per team  
- Go live  

---

## 14. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Wrong result published | Confirm screen + audit; Admin can unpublish |
| Scout info delayed | War Room updates status when info arrives; schedule shows last known state |
| Inappropriate public upload | Gallery Media must approve before visible |
| Live Media posts wrong clip | Audit + Admin can remove; trusted small team |
| Too many passwords | 4 team types, ~3 accounts each; one login per shift possible |

---

## 15. Decision checklist for headmaster

- [ ] **Four roles:** Admin · War Room · Live Media · Gallery Media  
- [ ] **No text live reports** — Scout/JRC inform War Room; War Room updates schedule status only  
- [ ] **Results:** Enter → review & confirm → publish (no verifier role)  
- [ ] **Live Media team:** Own login for live video coverage  
- [ ] **Gallery Media team:** Own login for photos/videos + public submission approval  
- [ ] **War Room does not handle media**  
- [ ] **Audit log** for all teams  
- [ ] **Defer** news articles and interviews to after festival  
- [ ] **Account count:** ~2 Admin + ~6 War Room + ~3 Live Media + ~3 Gallery Media  

**Approved by:** _________________________  **Date:** _____________

---

## 16. System diagram

```
                         ┌──────────────────────────────┐
                         │       PUBLIC WEBSITE          │
                         │  results · schedule · live   │
                         │  photos · videos · submit     │
                         └──────────────┬───────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         │                              │                              │
         ▼                              ▼                              ▼
   View results              View live videos              View gallery
   & schedule                & event status                & submit photo
         ▲                              ▲                              │
         │                              │                              ▼
         │                              │                    ┌─────────────────┐
         │                              │                    │ PENDING (public) │
         │                              │                    └────────┬────────┘
         │                              │                             │
  ┌──────┴───────┐              ┌───────┴────────┐            ┌───────┴────────┐
  │  WAR ROOM    │              │  LIVE MEDIA    │            │ GALLERY MEDIA  │
  │              │              │                │            │                │
  │ · Results    │              │ · Live video   │            │ · Upload       │
  │   enter +    │              │   coverage     │            │   photos/vids  │
  │   confirm    │              │                │            │ · Approve      │
  │ · Schedule   │              │                │            │   public subs  │
  │   status     │              │                │            │                │
  │   (Scout/JRC │              │                │            │                │
  │    info)     │              │                │            │                │
  └──────┬───────┘              └────────────────┘            └────────────────┘
         │
         │ audit
         ▼
  ┌──────────────┐
  │    ADMIN     │
  │ setup · users│
  │ · audit log  │
  └──────────────┘

  Scout / JRC ──(verbal)──► War Room   (no website login)
```

---

*Document version 2.0 — updated per team structure: War Room + Live Media + Gallery Media, no text live reports.*
