# Relax Phase 3.4 Commit Confirmation Gate

## Goal

Change Trellis Phase 3.4 so the commit-plan presentation is not a blocking confirmation gate when all dirty files are recognized as work from the current session.

## Requirements

- The AI still inspects dirty state, learns commit style, classifies files, and presents the commit plan for transparency.
- If all files to commit are recognized current-session task work, the AI proceeds with `git add` / `git commit` after presenting the plan instead of waiting for `ok`.
- Unrecognized dirty files remain protected: the AI must not stage them silently and should ask only when file ownership is ambiguous.
- Keep `/trellis:finish-work` as bookkeeping after work commits exist.

## Acceptance Criteria

- [x] `.trellis/workflow.md` describes Phase 3.4 as non-blocking for recognized task files.
- [x] Packaged workflow templates use the same behavior for new or updated projects.
- [x] Related finish-work/meta references no longer describe Phase 3.4 as user-confirmed.

## Technical Notes

- Primary source: `.trellis/workflow.md` and `packages/cli/src/templates/trellis/workflow.md`.
- Related user-facing references live in finish-work commands/prompts/skills and trellis-meta workflow references.