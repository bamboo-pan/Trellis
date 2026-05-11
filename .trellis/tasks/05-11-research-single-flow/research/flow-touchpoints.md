# Flow Touchpoints

## Source Surfaces

- `packages/cli/src/templates/trellis/workflow.md` is the canonical generated workflow text and contains the phase routing blocks.
- `packages/cli/src/templates/shared-hooks/session-start.py` injects task status and guidance for shared hook platforms.
- `packages/cli/src/templates/codex/hooks/session-start.py` and `packages/cli/src/templates/copilot/hooks/session-start.py` carry platform-specific Python copies.
- `packages/cli/src/templates/opencode/lib/session-utils.js` carries the OpenCode session-start guidance.
- `packages/cli/src/templates/common/skills/brainstorm.md` contains research-first guidance that currently dispatches `trellis-research`.

## Test Surfaces

- `packages/cli/test/regression.test.ts` has explicit assertions for sub-agent routing, research delegation, and generated session summary guidance.
- Step-level tests for `get_context.py --mode phase --platform ...` assert Codex/Pi sub-agent details and Kilo direct-mode details.

## Decision

Keep task phases and artifact gates intact, but make the main session responsible for research, implementation, and checks. Existing sub-agent templates can remain installed as platform capabilities; the workflow should stop routing default work through them.