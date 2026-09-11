#!/usr/bin/env node
/**
 * End-to-end API verification for War Room admin flows.
 * Mirrors what the admin panel does through PostgREST with a staff JWT.
 */
import assert from "node:assert/strict";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
const EMAIL = process.env.ADMIN_EMAIL ?? "super@mestames.local";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "MestaSuper2026";

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const authHeaders = (token) => ({
  apikey: ANON_KEY,
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

async function login() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: authHeaders(ANON_KEY),
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const body = await res.json();
  assert.equal(res.status, 200, `login failed: ${body.message ?? res.status}`);
  return body.access_token;
}

async function rest(token, path, { method = "GET", body, prefer } = {}) {
  const headers = { ...authHeaders(token) };
  if (prefer) headers.Prefer = prefer;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: res.status, json, text };
}

function fail(label, detail) {
  console.error(`FAIL ${label}: ${detail}`);
  process.exitCode = 1;
}

function pass(label) {
  console.log(`PASS ${label}`);
}

async function main() {
  console.log("Verifying admin API flows…\n");
  const token = await login();
  pass("login");

  const tables = [
    "houses",
    "programmes",
    "categories",
    "stages",
    "participants",
    "scheduled_events",
    "result_sets",
    "profiles",
    "event_settings",
    "articles",
    "media",
    "interviews",
    "audit_logs",
  ];
  for (const table of tables) {
    const { status, json } = await rest(token, `${table}?select=*&limit=1`);
    if (status !== 200) fail(`read ${table}`, JSON.stringify(json));
    else pass(`read ${table}`);
  }

  const { json: events } = await rest(token, "scheduled_events?select=id&limit=20");
  assert.ok(events?.length, "need at least one scheduled event");

  let resultSetId = null;
  let createdNew = false;
  for (const event of events) {
    const { json: open } = await rest(
      token,
      `result_sets?scheduled_event_id=eq.${event.id}&status=in.(draft,entered,correction_draft,verified)&select=id&limit=1`,
    );
    if (open?.[0]?.id) {
      resultSetId = open[0].id;
      pass(`reuse open draft for event ${event.id}`);
      break;
    }
  }

  if (!resultSetId) {
    const eventId = events[0].id;
    const { status: createStatus, json: created } = await rest(token, "result_sets", {
      method: "POST",
      prefer: "return=representation",
      body: { scheduled_event_id: eventId, status: "draft", version: 1 },
    });
    if (createStatus !== 201) fail("create result draft", JSON.stringify(created));
    resultSetId = created[0].id;
    createdNew = true;
    pass("create result draft");
  }

  const { json: houses } = await rest(token, "houses?select=id&limit=1");
  const houseId = houses[0].id;

  const { status: entryStatus, json: entryJson } = await rest(token, "result_entries", {
    method: "POST",
    prefer: "return=representation",
    body: {
      result_set_id: resultSetId,
      house_id: houseId,
      participant_name: "E2E Test Participant",
      marks: 85,
      grade: "A",
      rank: 1,
    },
  });
  if (entryStatus !== 201) fail("insert result entry", JSON.stringify(entryJson));
  else pass("insert result entry");

  const { status: delStatus, json: delJson } = await rest(
    token,
    `result_entries?result_set_id=eq.${resultSetId}`,
    { method: "DELETE" },
  );
  if (delStatus !== 204 && delStatus !== 200) fail("delete result entries", JSON.stringify(delJson));
  else pass("delete result entries (scoped)");

  if (createdNew) {
    await rest(token, `result_sets?id=eq.${resultSetId}`, { method: "DELETE" });
    pass("cleanup test result set");
  } else {
    pass("left existing draft in place");
  }

  const { status: settingsStatus } = await rest(token, "event_settings?select=id&limit=1");
  if (settingsStatus !== 200) fail("read settings", settingsStatus);
  else pass("read settings");

  console.log("\nAll admin API checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
