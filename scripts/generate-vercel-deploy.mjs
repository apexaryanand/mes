import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoreDirs = new Set(["node_modules", ".git", ".next", ".vercel", "supabase", ".cursor", "scripts"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).split(path.sep).join("/");
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      walk(full, out);
    } else {
      out.push(rel);
    }
  }
  return out;
}

const files = walk(root).sort();
const payload = {
  target: "production",
  name: "mesta-mes-track-arts",
  files: files.map((file) => ({
    file,
    data: fs.readFileSync(path.join(root, file), "utf8"),
  })),
};

fs.writeFileSync("/tmp/vercel-deploy-payload.json", JSON.stringify(payload));
console.log(`Wrote ${files.length} files (${fs.statSync("/tmp/vercel-deploy-payload.json").size} bytes)`);
