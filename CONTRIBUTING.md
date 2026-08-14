# Contributing to RepoCare

Thank you for helping make open-source maintenance more sustainable.

## Development setup

1. Install Node.js 20 or newer.
2. Fork and clone the repository.
3. Run `npm install`.
4. Run `npm test` before submitting a pull request.

## Design principles

- Keep the default scan local and deterministic.
- Prefer actionable evidence over opaque scoring.
- Avoid runtime dependencies unless they clearly reduce maintenance risk.
- Do not add network access to a default rule.
- Add tests for every scoring change.

For new rules, explain the maintainer problem, evidence checked, false-positive risks, score weight, and suggested remediation in the pull request.
