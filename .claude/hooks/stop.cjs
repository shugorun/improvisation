// Stop hook for the app-development boilerplate. Cross-platform (Node).
//
// Advisory (non-blocking) nudge: when there are UNCOMMITTED changes AND today has no
// entry in docs/progress/, surface a `systemMessage` suggesting a checkpoint.
// `systemMessage` is shown to the user (not fed to Claude), so the note is visible in
// the normal view -- plain stdout from a Stop hook only surfaces in transcript mode.
//
// Why "no entry for today" rather than just "dirty": the Stop hook fires after EVERY
// turn, so a dirty-only check would nag on essentially every turn all day. Keying off
// "today not logged yet" bounds the noise -- it nudges only while the checkpoint
// discipline is being skipped, and goes silent the moment the first progress entry for
// today exists. It never blocks the stop. A clean tree, or the bare template (no weekly
// progress log), stays silent.

const { execSync } = require("node:child_process");
const { existsSync, readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

// Read stdin payload (Claude Code passes JSON). Skip if this stop is already a
// continuation triggered by a previous stop hook.
let payload = null;
try { payload = JSON.parse(readFileSync(0, "utf8")); } catch { payload = null; }
if (payload && payload.stop_hook_active) process.exit(0);

const repoRoot = join(__dirname, "..", "..");

// Only nudge when actual work happened this session.
let dirty = false;
try {
  const out = execSync("git status --porcelain", {
    cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
  });
  dirty = out.trim().length > 0;
} catch { /* git unavailable / not a repo -> treat as clean */ }
if (!dirty) process.exit(0);

const d = new Date();
const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const progressDir = join(repoRoot, "docs", "progress");
let loggedToday = false;
try {
  if (existsSync(progressDir)) {
    for (const f of readdirSync(progressDir)) {
      if (!f.endsWith(".md") || f === "_index.md") continue;
      if (readFileSync(join(progressDir, f), "utf8").includes(today)) { loggedToday = true; break; }
    }
  }
} catch { /* ignore */ }
if (loggedToday) process.exit(0);

process.stdout.write(JSON.stringify({
  systemMessage: `Note: uncommitted changes present but docs/progress/ has no entry for today (${today}). Consider /checkpoint for the finished work unit, or /wrapup-project before ending.`,
}) + "\n");
process.exit(0);
