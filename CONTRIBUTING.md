# Contributing to RepoCare

Thank you for helping make open-source maintenance more sustainable.

## Development setup

1. Install Node.js 20 or newer.
2. Fork and clone the repository.
3. Run `npm install`.
4. Create a focused branch for the change.
5. Run the complete local verification before submitting a pull request:

```bash
npm run check
npm test
npm run scan:self
npm pack --dry-run
```

## Pull requests

- Keep changes focused and explain the maintainer problem being solved.
- Add or update tests for behavior changes.
- Update the README, rule reference, or changelog when users will notice the change.
- Avoid generated dependency or formatting churn unrelated to the proposal.
- Expect CI to run on Node.js 20, 22, and 24.

## Design principles

- Keep the default scan local and deterministic.
- Prefer actionable evidence over opaque scoring.
- Avoid runtime dependencies unless they clearly reduce maintenance risk.
- Do not add network access to a default rule.
- Add tests for every scoring change.

For new rules, explain the maintainer problem, evidence checked, false-positive risks, score weight, and suggested remediation in the pull request.

## Project structure

- `src/rules.ts` contains deterministic rule evaluation.
- `src/scanner.ts` assembles the versioned report schema and score.
- `src/reporters.ts` renders text, Markdown, and JSON.
- `src/cli.ts` owns argument parsing, output, and exit codes.
- `tests/` exercises user-visible behavior.

Please open a feature request before starting a large change so the approach can be discussed early.
