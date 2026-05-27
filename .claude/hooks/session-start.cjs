// SessionStart hook for the app-development boilerplate.
// Cross-platform (Node). stdout is injected into the session context by Claude Code.
process.stdout.write(`[project session start]
- Start with /catchup-project when the user wants to resume context.
- For natural-language work requests, run /work: confirm blockers + user tasks up front, then work in committable units (file issues/ADRs as they arise). Rules: docs/02-GUIDELINES.md.
- Phases P0-P6 advance only when the current gate passes (docs/03-ROADMAP.md). MVP is mvp/, real build is app/.
- At each finished work unit, checkpoint: append to docs/progress/ and commit if green (/checkpoint). Push is batched at /wrapup-project.
- End with /wrapup-project to update docs and commit + push (do not leave uncommitted/unpushed work).
- Docs start at docs/00-INDEX.md and docs/05-PROGRESS.md.
`);
