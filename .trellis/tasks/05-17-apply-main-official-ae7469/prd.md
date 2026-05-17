# Apply main_official commit ae7469

## Goal

Apply commit `ae7469ca7b3be398cfffe448e4e9d1d0aee2ab7c` from `main_official` onto the current branch `main_offical_single`.

## What I Already Know

- Current branch is `main_offical_single` and the working tree was clean before task creation.
- `origin/main_official` exists and was fetched.
- The target commit is `fix: block archived task recreate collisions`.
- The commit touches task-store Python logic, the packaged Trellis script template, regression tests, and workspace journal files.

## Requirements

- Apply the target commit to the current branch without overwriting unrelated user work.
- Resolve any cherry-pick conflicts in favor of preserving the intended archived-task collision guard.
- Keep `.trellis/scripts/` and `packages/cli/src/templates/trellis/scripts/` behavior aligned.
- Verify the relevant regression test path after applying the commit.

## Acceptance Criteria

- [ ] Target commit changes are present on the current branch.
- [ ] Working tree contains only expected task and cherry-pick changes.
- [ ] Relevant tests pass or any pre-existing/blocking failures are documented.

## Out of Scope

- No unrelated refactors or release changes.
- No branch creation or git commit unless explicitly requested.

## Technical Notes

- Relevant specs: `cli/backend`, `cli/unit-test`, shared code reuse and cross-layer guides.