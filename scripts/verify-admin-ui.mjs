#!/usr/bin/env node
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const EMAIL = process.env.ADMIN_EMAIL ?? "super@mestames.local";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "MestaSuper2026";

const routes = [
  { path: "/war-room", label: "operations" },
  { path: "/war-room/results", label: "results list" },
  { path: "/war-room/schedule", label: "schedule" },
  { path: "/war-room/catalog?tab=houses", label: "catalog houses" },
  { path: "/war-room/catalog?tab=programmes", label: "catalog programmes" },
  { path: "/war-room/catalog?tab=categories", label: "catalog categories" },
  { path: "/war-room/catalog?tab=stages", label: "catalog stages" },
  { path: "/war-room/catalog?tab=participants", label: "catalog participants" },
  { path: "/war-room/content?tab=moderation", label: "content moderation" },
  { path: "/war-room/content?tab=articles", label: "content articles" },
  { path: "/war-room/content?tab=uploads", label: "content uploads" },
  { path: "/war-room/content?tab=interviews", label: "content interviews" },
  { path: "/war-room/system?tab=settings", label: "system settings" },
  { path: "/war-room/system?tab=users", label: "system users" },
  { path: "/war-room/system?tab=audit", label: "system audit" },
];

const redirects = [
  { from: "/war-room/participants", to: "/war-room/catalog" },
  { from: "/war-room/settings", to: "/war-room/system" },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];

  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });

  console.log("UI verification at", BASE);

  await page.goto(`${BASE}/war-room/login`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.getByRole("button", { name: /log in/i }).click();
  await page.waitForURL(/\/war-room(?!\/login)/, { timeout: 15000 });
  console.log("PASS login");

  for (const { path, label } of routes) {
    const res = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    const status = res?.status() ?? 0;
    const body = await page.content();
    const hasError =
      body.includes("DELETE requires a WHERE clause") ||
      body.includes("Application error") ||
      body.includes("Internal Server Error");
    if (status >= 500 || hasError) {
      console.error(`FAIL ${label} (${path}) status=${status}`);
      process.exitCode = 1;
    } else {
      console.log(`PASS ${label}`);
    }
  }

  for (const { from, to } of redirects) {
    await page.goto(`${BASE}${from}`, { waitUntil: "networkidle" });
    const url = page.url();
    if (!url.includes(to)) {
      console.error(`FAIL redirect ${from} -> expected ${to}, got ${url}`);
      process.exitCode = 1;
    } else {
      console.log(`PASS redirect ${from}`);
    }
  }

  await page.goto(`${BASE}/war-room/results`, { waitUntil: "networkidle" });
  const draftLink = page.locator('a[href^="/war-room/results/"]').first();
  const createForm = page.locator('form[action*="createDraftForEventForm"], form').filter({
    has: page.getByRole("button", { name: /enter|create|start|draft/i }),
  }).first();

  if (await draftLink.count()) {
    await draftLink.click();
    await page.waitForURL(/\/war-room\/results\//, { timeout: 10000 });
    console.log("PASS open existing result editor");
  } else if (await createForm.count()) {
    await createForm.getByRole("button").first().click();
    await page.waitForURL(/\/war-room\/results\//, { timeout: 10000 });
    const content = await page.content();
    if (content.includes("DELETE requires a WHERE clause")) {
      console.error("FAIL create result draft UI");
      process.exitCode = 1;
    } else {
      console.log("PASS create result draft UI");
    }
  }

  if (page.url().includes("/war-room/results/")) {
    const nameInput = page.locator('input[name^="name_"]').first();
    if (await nameInput.count()) {
      await nameInput.fill("UI Verify Participant");
      await page.locator('input[name^="marks_"]').first().fill("88");
      await page.getByRole("button", { name: /save/i }).click();
      await page.waitForTimeout(4000);
      const after = await page.content();
      if (after.includes("DELETE requires a WHERE clause")) {
        console.error("FAIL save result entries");
        process.exitCode = 1;
      } else if (after.includes("error=")) {
        console.error("FAIL save result entries redirect error");
        process.exitCode = 1;
      } else {
        console.log("PASS save result entries");
      }
    }
  }

  if (errors.length) {
    console.error("Captured errors:", errors.slice(0, 5).join("\n"));
    process.exitCode = 1;
  }

  await browser.close();
  if (!process.exitCode) console.log("\nAll UI checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
