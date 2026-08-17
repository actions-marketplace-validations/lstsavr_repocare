# Release process

RepoCare uses semantic versioning while the public API and report schema are pre-1.0.

1. Update `CHANGELOG.md` and keep `src/scanner.ts` and `package.json` versions aligned.
2. Run `npm test`, `npm run scan:self`, and `npm pack --dry-run`.
3. Merge the release changes into `main` and confirm CI is green.
4. Create and push an annotated `vX.Y.Z` tag.
5. The release workflow verifies the tag, runs the test suite, publishes to npm when `NPM_TOKEN` is configured, and creates the GitHub release.
6. Verify installation with `npx repocare@X.Y.Z --version` after npm publication.

For automated npm publication, configure the repository as a trusted publisher in the npm package settings when available, or add a granular `NPM_TOKEN` repository secret with the minimum required package permissions. Prefer short-lived trusted publishing over a long-lived token.

Never reuse or move a published version tag. If publication fails after the version exists on npm, prepare a new patch release.
