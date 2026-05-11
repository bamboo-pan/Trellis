# Fix subagent template policy drift

## Problem

Generated projects currently receive root `AGENTS.md` guidance that says to spawn subagents automatically for parallelizable, long-running, or risk-isolated work. That conflicts with the current Trellis workflow, which routes research, implementation, and checking through the main session by default.

## Goal

Align generated root agent guidance with `.trellis/workflow.md` so future `trellis init` / `trellis update` output clearly preserves the main-agent-only workflow.

## Requirements

- Update the markdown `AGENTS.md` template source so Trellis workflow steps are explicitly main-agent-only.
- Make the prohibition explicit: do not spawn or delegate to subagents for Trellis workflow steps.
- State that platform subagent files, if present, are disabled for this workflow unless the user explicitly changes the policy in the current request.
- Update tests that assert the old generated subagent text.
- Run focused verification for the changed template/test behavior.

## Out of Scope

- Removing platform-specific `trellis-*` agent files.
- Changing `.trellis/workflow.md` main-session routing.
- Changing runtime hook behavior.
