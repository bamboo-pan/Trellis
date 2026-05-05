# Verification Notes

- `node scripts/check-manifest-continuity.js` passed for `@bamboo-pan/trellis` with 0 published versions.
- `pnpm --filter @bamboo-pan/trellis typecheck` passed.
- `pnpm --filter @bamboo-pan/trellis build` passed.
- `pnpm --filter @bamboo-pan/trellis test` failed on existing Windows-sensitive assertions unrelated to this package rename, including CRLF vs LF expectations in template tests.
- `pnpm --filter @bamboo-pan/trellis lint` failed on an existing unused `vi` import in `packages/cli/test/configurators/shared.test.ts`, which was not touched by this task.
- `README_FORK.md` and `README_FORK_CN.md` now summarize fork-only changes compared with upstream `https://github.com/mindfold-ai/Trellis`.
- `prepublishOnly` copies both fork README files into the package as `README.md` and `README_CN.md`.
- Fork README install docs now state that `@rc` requires publishing with `pnpm publish --access public --tag rc`.