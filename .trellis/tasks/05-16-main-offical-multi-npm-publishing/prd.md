# Configure main_offical_multi npm publishing

## Goal

Create a `main_offical_multi` branch from the existing official baseline and apply the fork npm publishing configuration for the `@bamboo-pan/trellis` package, using the branch suffix `multi` for version/tag naming.

## Known Facts

- The user requested a new `main_offical_multi` branch from `main_offical`.
- The repository has `main_official` and `main_offical_single`; no exact `main_offical` branch exists locally or on `origin`.
- `main_official` is the official package baseline using `@mindfoldhq/trellis`.
- `main_offical_single` shows the fork release pattern using `@bamboo-pan/trellis`, fork README prepublish copy, `0.5.16-single.0`, and npm dist-tag `single`.
- Current `main` already uses `@bamboo-pan/trellis` and `0.5.0-multi.0`, but its publish workflow does not contain a `multi` dist-tag branch.

## Requirements

- Create/switch to `main_offical_multi` from `main_official`.
- Apply npm publishing configuration analogous to the current fork/main and single branch patterns.
- Publish target package name must be `@bamboo-pan/trellis`.
- Use branch-name-derived naming for the npm prerelease/dist-tag: `multi`.
- Do not perform an actual npm publish in this task.

## Acceptance Criteria

- [ ] Git branch `main_offical_multi` exists and is checked out.
- [ ] Root package scripts filter `@bamboo-pan/trellis`.
- [ ] CLI package metadata targets `@bamboo-pan/trellis` with fork repository/homepage/bugs metadata and fork README prepublish copy.
- [ ] CLI package version includes the `multi` prerelease suffix.
- [ ] Publish workflow builds `@bamboo-pan/trellis` and maps `-multi` versions to npm dist-tag `multi`.
- [ ] Manifest helper scripts query `@bamboo-pan/trellis` on npm.
- [ ] CI/build checks pass or any failure is reported.

## Out of Scope

- Running `npm publish`.
- Changing package runtime behavior.
- Creating commits or tags unless explicitly requested.

## Technical Notes

- Relevant files are expected to include `package.json`, `packages/cli/package.json`, `.github/workflows/ci.yml`, `.github/workflows/publish.yml`, `packages/cli/scripts/create-manifest.js`, and `packages/cli/scripts/check-manifest-continuity.js`.
- `README_FORK.md` and `README_FORK_CN.md` may need to be present on the new branch because `prepublishOnly` copies them into the package before publish.
