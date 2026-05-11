# Main-Session Trellis Flow

## Goal

Change Trellis' generated workflow guidance so agent-capable platforms keep the same Plan -> Execute -> Finish phases, but default research, implementation, and checking work is done by the main session instead of sub-agents.

## Requirements

- Keep the existing phase order and required gates: task creation, PRD confirmation, context setup, activation, implementation, quality check, spec-update judgment, and commit guidance.
- Replace default `trellis-research`, `trellis-implement`, and `trellis-check` dispatch instructions with main-session instructions.
- Preserve persistence requirements: research findings still go to `{TASK_DIR}/research/*.md`, and important context still lives in task artifacts instead of chat only.
- Preserve idempotence guidance: `[once]` steps are skipped when their artifacts already exist, so work is not repeated.
- Update session-start/status guidance and regression tests so generated platforms agree with the new main-session flow.

## Non-Goals

- Remove existing sub-agent template files or platform capabilities.
- Redesign task status storage, lifecycle hooks, or task schema.

## Acceptance Criteria

- Workflow text no longer blocks agent-capable platforms from main-session implementation/check work.
- Session-start summaries tell the main session to load/read the needed specs and perform implementation/check directly.
- Research guidance persists findings without dispatching `trellis-research`.
- Tests that asserted sub-agent dispatch are updated to assert main-session routing and no-repeat guidance.