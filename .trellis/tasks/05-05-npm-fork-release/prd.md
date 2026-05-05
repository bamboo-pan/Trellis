# Prepare bamboo-pan npm fork release

## Goal

Publish this fork as a distinct npm package under the user's npm scope while keeping the repository tied to the fork source.

## Requirements

- Rename the npm package from `@mindfoldhq/trellis` to `@bamboo-pan/trellis`.
- Keep the package publicly publishable.
- Point package repository metadata at `https://github.com/bamboo-pan/Trellis.git`.
- Update workspace scripts and CI publish workflow filters so builds target the renamed package.
- Add a separate README that explains this fork, links to the original project, and distinguishes fork-specific changes from upstream Trellis.
- Avoid changing runtime behavior beyond package metadata and documentation.

## Acceptance Criteria

- `@bamboo-pan/trellis` is the package name in the CLI package metadata.
- Root scripts and publish workflow no longer filter on `@mindfoldhq/trellis`.
- A fork README exists and clearly references the upstream repository at `https://github.com/mindfold-ai/Trellis`.
- Package build/check commands pass or any pre-existing failures are reported.