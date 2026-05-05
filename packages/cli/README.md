# Trellis Fork: bamboo-pan Distribution

[简体中文](./README_FORK_CN.md)

This repository is a fork of the upstream Trellis project. Use this document to distinguish the bamboo-pan distribution from the official Mindfold release.

- Upstream repository: https://github.com/mindfold-ai/Trellis
- Fork repository: https://github.com/bamboo-pan/Trellis
- Upstream npm package: `@mindfoldhq/trellis`
- Fork npm package: `@bamboo-pan/trellis`

## Comparison Baseline

The fork-only summary below was checked on 2026-05-05 against upstream `mindfold-ai/Trellis` main at `33efa6476d89cffcd979f3b2b0ec4542109d8074`. The fork baseline was `bamboo-pan/Trellis` main at `c811d9ad68c19e2231b4140484a9f9cca413bd88`, plus the npm fork packaging changes in this branch.

If either repository moves forward, rerun the upstream diff and update this section before publishing a new fork release.

## Install

This fork keeps the original CLI command names for drop-in compatibility:

```bash
npm install -g @bamboo-pan/trellis@rc
trellis init -u your-name
```

The `@rc` install command assumes the fork package has been published with the `rc` npm dist-tag, for example `pnpm publish --access public --tag rc` from `packages/cli`.

Maintainers should follow the documented fork publish flow in [docs/fork-npm-publish.md](../../docs/fork-npm-publish.md). The reliable manual path is npm web login first, then token-based publish through a temporary npm userconfig.

The package also exposes the short command:

```bash
tl --help
```

Because the fork keeps `trellis` and `tl` as global command names, installing it globally alongside `@mindfoldhq/trellis` will make the last installed package own those command shims.

## Changes Not Present in Upstream

| Area | bamboo-pan fork change | User impact |
| --- | --- | --- |
| npm distribution identity | Renames the package to `@bamboo-pan/trellis`, points repository/homepage/issues metadata at `bamboo-pan/Trellis`, and changes workspace, CI, publish, manifest, and release checks to target the fork package. | Users install the fork explicitly. Fork releases no longer query or publish against the official `@mindfoldhq/trellis` package. |
| Fork-specific package README | Publishes this fork README as the npm package README and includes a Chinese fork note file in the package. | The npm package page and tarball identify the build as an unofficial bamboo-pan distribution. |
| Workflow state machine | Adds a lightweight task workflow state machine around `task.py`, including persisted `meta.workflow.current_step`, workflow guard/mark behavior, and new Trellis template scripts such as `workflow_state.py`. | The normal path is harder to skip accidentally: implementation, check, spec review, commit, finish, and archive have stronger command-level gates. |
| PRD confirmation gate | Adds PRD status tracking before `task.py start`, with explicit confirmation or override required before moving from planning into implementation. | Agents should not start implementation before the task requirements are confirmed. |
| Check freshness and finish gates | Records check freshness and commit state so later code/spec changes can invalidate stale checks. Git projects require a recorded current commit before finish/archive; non-git projects can skip the commit gate. | Reduces cases where an agent finishes after unchecked edits, stale checks, or an unrecorded commit. |
| Main-session agent-flow hardening | Adds workflow guidance and platform hooks around when the main session should dispatch `trellis-implement`, `trellis-check`, and spec review work. | The fork aims to keep implementation/check/spec-review roles more consistent across agent platforms. |
| Platform-specific fixes | Adds fork-only fixes for Codex sub-agent task fallback and OpenCode POSIX shell context prefixes. | Improves task-context recovery and generated command compatibility in shell-sensitive agent environments. |
| Validation artifacts | Adds fork-local evaluation and review notes such as `Test_results.md` and `trellis-platform-state-machine-review.md`. | Users can inspect why the workflow state machine exists and which behaviors improved compared with the RC baseline. |

## What Stays the Same

- The project is still Trellis: an AI coding harness for specs, tasks, workflows, and session memory.
- The CLI entry points remain `trellis` and `tl` for compatibility.
- The license remains `AGPL-3.0-only`; keep the upstream license and source availability requirements in mind when publishing modified builds.
- Upstream documentation remains useful for core concepts and workflows: https://docs.trytrellis.app/

## Release Note Maintenance

Before each fork release, update "Changes Not Present in Upstream" with behavior differences that users would notice. Do not list purely local task logs unless they explain a shipped behavior or validation result.

## Original Project Credit

Trellis is originally developed by Mindfold. This fork is not the official Mindfold npm package. For the official source, releases, issues, and project branding, use https://github.com/mindfold-ai/Trellis.