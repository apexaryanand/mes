# Kalolsavam Live — Simplification Plan

**For:** Headmaster approval · MES HSS Irimbiliyam  
**Prepared:** 9 September 2026  
**Status:** Proposal (not yet built)

---

## 1. Executive summary

Kalolsavam Live is a **public website** (results, schedule, live updates, photos) plus a **War Room** (student-operated back office). The system works, but it was designed with **too many staff roles and too many steps** — similar to a large newsroom, not a school festival run by a small Little KITES team.

**Proposal:** Reduce to **2 staff roles + public**, merge workflows into one War Room login, and replace the separate “verifier” person with a **mandatory review-and-confirm step** before any result goes live. Every publish action is logged with the student’s name.

**Outcome:** Same public experience, fewer passwords, clearer responsibility, easier to train in one session.

---

## 2. What we have today (too complex)

| Area | Today | Problem |
|------|--------|---------|
| **Staff roles** | 7 types: super_admin, results_operator, results_verifier, reporter, editor, media_moderator, photographer | Too many logins and permission rules to explain |
| **Results** | 4 steps: draft → entered → **verified by another person** → published | Needs two students for every result sheet |
| **Live reports** | Separate `/reporter` app + War Room “Live” page | Two places for the same job |
| **Media** | Public upload → moderator approves; photographer role exists but barely used | Extra role for one button |
| **News / interviews** | Editor + photographer roles, separate pages | Nice-to-have during live festival; adds training load |
| **Admin setup** | Categories, stages, settings locked to super_admin only | Fine, but scattered across many nav items |

---

## 3. What we propose (simple)

### 3.1 Only two kinds of login

| Role | Who | Count (suggested) | Can do |
|------|-----|-------------------|--------|
| **Admin** | Teacher / festival coordinator | 1–2 accounts | Festival settings, schools, categories, programmes, stages, schedule, create/disable War Room accounts, view full audit log |
| **War Room** | Little KITES students on duty | 4–8 accounts (shared shifts) | Enter results → **review & confirm** → publish; approve/reject public photos & videos; post live stage reports; mark schedule items live/completed |

**Removed roles:** results_operator, results_verifier, reporter, editor, media_moderator, photographer (all merged into **War Room** or **Admin**).

**Public:** No login. Anyone can view the site and submit photos/videos (pending until War Room approves).

### 3.2 Recommended login count

| Role | Accounts | Notes |
|------|----------|-------|
| Admin | 2 | Main coordinator + backup (e.g. ICT teacher) |
| War Room | 6 | ~2 students per shift × 3 shifts/day; same password per shift optional, or individual accounts for audit |
| **Total** | **8** | Down from a theoretical 7 role types × multiple people |

---

## 4. Result workflow (new)

### Today
```
Student A enters marks → submits for verification
Student B (different login) verifies → publishes
```
Requires two trained people and a “verifier” role.

### Proposed — same person, forced second check
```
Step 1 — ENTER
  Student fills result sheet (school, participant, marks, grade, rank)
  Saves as "Draft" (not public)

Step 2 — REVIEW & CONFIRM (required)
  Same student (or any War Room student on duty) opens "Pending confirmation"
  Sees read-only summary: programme, category, all rows, totals
  Must tick: "I have checked this sheet against the official paper"
  Clicks "Confirm & publish to website"

Step 3 — LIVE
  Result appears on public site and school rankings update
  Audit log records: who entered, who confirmed, timestamp
```

**No separate verifier login.** The **two-step UI** replaces the second person — but audit still shows who did each step.

### If a mistake is published
- Admin or War Room uses **“Unpublish / correct”** → creates a new draft version
- Old version archived; correction also needs review & confirm
- Audit trail kept (who changed what)

---

## 5. Media workflow (new)

```
Public visitor → /submit → uploads photo/video
                         ↓
              Status: Pending (not on website)
                         ↓
War Room → Media queue → Approve or Reject
                         ↓
              Approved → visible on /photos and /videos
```

One queue, one approve button, one role. No photographer/editor split.

---

## 6. Live stage reports (new)

**Remove** separate `/reporter` login.

War Room students post updates from **one screen** inside War Room (stage, optional event, short text). Posts go public immediately — same as today, but no second app or role.

Optional safeguard (Phase 2): short cooldown or “preview before post” if headmaster wants tighter control.

---

## 7. What stays on the public website (unchanged)

- Home dashboard, live “now happening”, latest results, school points table  
- Full schedule, schools list, programme list  
- Search  
- Submit photo/video (moderated)  
- Malayalam / English toggle  
- WhatsApp share on results  

**No login required for visitors.**

---

## 8. What we simplify or postpone

| Feature | Decision |
|---------|----------|
| Articles / News | **Phase 2** — not needed on Day 1 of festival; Admin can add later if wanted |
| Winner interviews | **Phase 2** — same |
| Appeal status on results | **Hide** until officially needed |
| Official PDF upload on result sheets | **Phase 2** — paper sheets can be scanned later |
| Separate reporter phones | **Remove** — use War Room on one tablet/laptop per desk |
| 7-role user management | **Replace** with Admin + War Room dropdown only |

---

## 9. War Room navigation (after simplification)

**Admin sees:**
- Dashboard  
- Settings (festival name, dates, live status)  
- Schools · Participants · Categories · Programmes · Stages · Schedule  
- Users (create War Room accounts)  
- Audit log (full history)  

**War Room sees:**
- Dashboard (what’s live, what’s pending confirmation, pending media count)  
- Results (enter + **pending confirmation** queue)  
- Schedule (view + update status: upcoming / live / done)  
- Media (approve / reject)  
- Live reports (post updates)  

**~6 menu items** for students instead of 12+ spread across roles.

---

## 10. Accountability (audit log)

Every sensitive action recorded with **name + time**:

| Action | Logged |
|--------|--------|
| Result saved as draft | ✓ |
| Result confirmed & published | ✓ |
| Result corrected / unpublished | ✓ |
| Media approved / rejected | ✓ |
| Live report posted / removed | ✓ |
| Schedule status changed | ✓ |
| Admin changes settings or catalog | ✓ |

Visible to **Admin** (full log). War Room students see **their own** actions optional — policy decision.

---

## 11. Training plan (one session, ~45 minutes)

1. **Admin (15 min):** Upload schools CSV, add categories/programmes/stages, build schedule, create War Room logins  
2. **War Room (20 min):** Enter one practice result → review screen → confirm; approve one practice photo; post one live update  
3. **Everyone (10 min):** Show public site updating in real time; show audit log entry  

Practice data cleared before festival.

---

## 12. Implementation phases

### Phase A — Approval (this meeting)
- Headmaster signs off on: 2 roles, result confirm flow, media moderation in War Room, defer articles/interviews

### Phase B — Build (after approval)
- Collapse 7 roles → 2 in database and UI  
- New “Pending confirmation” results queue and confirm screen  
- Merge reporter into War Room  
- Simplify nav and user management  
- Extend audit log to media + live updates  

### Phase C — Festival eve
- Admin loads real schools, schedule, participants  
- Dry run with 2–3 War Room students  
- Go live  

---

## 13. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Student publishes wrong result | Mandatory review screen; audit shows who confirmed; Admin can unpublish |
| Too many students sharing one login | Prefer individual accounts (audit); or one login per shift with sign-in sheet |
| Public uploads inappropriate content | Nothing goes live until War Room approves |
| Internet down | Results still entered in War Room; sync when back (Supabase offline strategy — discuss if needed) |

---

## 14. Decision checklist for headmaster

Please tick approval:

- [ ] **Two roles only:** Admin + War Room (remove 5 other role types)  
- [ ] **Results:** Enter → review & confirm → publish (no separate verifier)  
- [ ] **Media:** Public submit → War Room approve  
- [ ] **Live reports:** Inside War Room only (remove reporter login)  
- [ ] **Defer:** News articles and winner interviews to after festival unless time allows  
- [ ] **Audit log:** Keep for accountability  
- [ ] **Suggested accounts:** 2 Admin + 6 War Room  

**Approved by:** _________________________  **Date:** _____________

---

## 15. One-page diagram

```
                    ┌─────────────────────────────────────┐
                    │         PUBLIC WEBSITE              │
                    │  (no login — everyone can view)     │
                    │  results · schedule · live · media  │
                    └──────────────┬──────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
        View published      Submit photo/video    Search schools
              │                    │
              │                    ▼
              │            ┌───────────────┐
              │            │ PENDING queue │
              │            └───────┬───────┘
              │                    │
              ▼                    ▼
    ┌─────────────────────────────────────────────┐
    │              WAR ROOM (student login)        │
    │  · Enter results → Review & confirm → Live   │
    │  · Approve / reject public media             │
    │  · Post live stage reports                   │
    │  · Update schedule status                    │
    └─────────────────────┬───────────────────────┘
                          │ audit log
                          ▼
    ┌─────────────────────────────────────────────┐
    │              ADMIN (teacher login)           │
    │  · Festival setup · schools · schedule       │
    │  · Manage War Room accounts · full audit     │
    └─────────────────────────────────────────────┘
```

---

*Document version 1.0 — for discussion only. Implementation begins after written approval.*
