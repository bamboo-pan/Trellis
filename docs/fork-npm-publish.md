# Fork npm Publishing Runbook

This runbook records the manual publish path for the bamboo-pan fork package, `@bamboo-pan/trellis`. It exists because npm can reject a publish with an OTP challenge even after token authentication. The reliable sequence is:

1. Complete npm web login for the `@bamboo-pan` scope.
2. Publish with a temporary npm userconfig that reads the token from a local file.
3. Move npm dist-tags so both `rc` and `latest` point at the newly published fork package.
4. Delete the temporary config and verify the npm dist-tags.

Do not commit `.npmrc` files or token values.

## Prerequisites

- You have npm publish permission for `@bamboo-pan/trellis`.
- You have a local npm token file. On the maintainer machine this is currently `C:\Users\bamboo\Documents\github\nppm.txt`; other maintainers should use their own token path.
- The release commit has already been pushed.
- The target version in `packages/cli/package.json` has not already been published.
- Required checks have already passed. If you publish with `--ignore-scripts`, run the package checks and build manually first, because `prepublishOnly` will be skipped.

## Dist-Tag Convention

For the bamboo-pan fork, the newest published package should be the default npm install target. For rc releases, publish with the `rc` tag and then explicitly move `latest` to the same version. The `npm publish --tag rc` command only updates `rc`; it does not update `latest`.

After each successful rc publish, `npm view @bamboo-pan/trellis dist-tags` should show both `rc` and `latest` pointing at the new version unless a release owner intentionally chooses a different default.

Recommended pre-publish checks from the repository root:

```powershell
Set-Location "C:\Users\bamboo\Desktop\Trellis"
node .\packages\cli\scripts\check-manifest-continuity.js
pnpm --filter @bamboo-pan/trellis typecheck
pnpm --filter @bamboo-pan/trellis build
```

For a normal release environment with passing full tests, also run the full package test suite before publishing.

If you intentionally publish with `--ignore-scripts`, manually perform the file copies normally handled by `prepublishOnly` before running `npm publish`:

```powershell
Set-Location "C:\Users\bamboo\Desktop\Trellis\packages\cli"
Copy-Item ..\..\README_FORK.md .\README.md -Force
Copy-Item ..\..\README_FORK_CN.md .\README_CN.md -Force
Copy-Item ..\..\LICENSE .\LICENSE -Force
```

## 1. Confirm the Target Version

```powershell
Set-Location "C:\Users\bamboo\Desktop\Trellis\packages\cli"
$version = node -p "require('./package.json').version"
npm view "@bamboo-pan/trellis@$version" version --registry=https://registry.npmjs.org/
```

If npm returns a version, do not publish again with the same version. Bump to the next rc/beta/patch version first.

## 2. Web Login First

Always do this before the token publish step. It avoids repeating the OTP failure path seen when token auth was attempted first.

```powershell
Set-Location "C:\Users\bamboo\Desktop\Trellis\packages\cli"
npm login --auth-type=web --registry=https://registry.npmjs.org/ --scope=@bamboo-pan
```

Open the npm URL, complete the browser login, then return to the terminal after it reports success.

## 3. Publish with the Token via Temporary Userconfig

Set `NPM_TOKEN_PATH` to the token file for the current machine. The maintainer machine uses `C:\Users\bamboo\Documents\github\nppm.txt`.

```powershell
Set-Location "C:\Users\bamboo\Desktop\Trellis\packages\cli"
$env:NPM_TOKEN_PATH = "C:\Users\bamboo\Documents\github\nppm.txt"
$version = node -p "require('./package.json').version"
$token = (Get-Content $env:NPM_TOKEN_PATH -Raw).Trim()
$tmpNpmrc = Join-Path $env:TEMP ("trellis-publish-" + [guid]::NewGuid().ToString() + ".npmrc")
"//registry.npmjs.org/:_authToken=$token`n@bamboo-pan:registry=https://registry.npmjs.org/`nregistry=https://registry.npmjs.org/" | Set-Content -Path $tmpNpmrc -NoNewline -Encoding ASCII

try {
  npm whoami --userconfig $tmpNpmrc --registry=https://registry.npmjs.org/
  npm publish --tag rc --access public --ignore-scripts --userconfig $tmpNpmrc --registry=https://registry.npmjs.org/
  npm dist-tag add "@bamboo-pan/trellis@$version" latest --userconfig $tmpNpmrc --registry=https://registry.npmjs.org/
} finally {
  Remove-Item $tmpNpmrc -Force -ErrorAction SilentlyContinue
  Remove-Variable token -ErrorAction SilentlyContinue
}
```

Use `--tag rc` for release candidates, then run the `npm dist-tag add ... latest` command above so default installs track the newest fork build.

## 4. Verify the Published Version and Dist-Tag

```powershell
Set-Location "C:\Users\bamboo\Desktop\Trellis\packages\cli"
$version = node -p "require('./package.json').version"
npm view "@bamboo-pan/trellis@$version" version dist-tags --registry=https://registry.npmjs.org/
```

Expected rc output shape:

```text
version = '0.5.0-rc.N'
dist-tags = { latest: '0.5.0-rc.N', rc: '0.5.0-rc.N' }
```

## Failure Notes

- `npm ERR! code EOTP`: complete the web login step, then rerun the token publish step. If it still fails, the token does not have publish/bypass-2FA permissions and must be replaced or accompanied by an OTP.
- `npm ERR! 403 You cannot publish over the previously published versions`: the version already exists on npm; bump the package version before publishing.
- Never print the token, commit `.npmrc`, or leave the temporary npm config behind.
