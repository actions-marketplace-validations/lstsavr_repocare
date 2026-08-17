# Changelog

All notable changes to RepoCare are documented here.

## [Unreleased]

## [0.2.0] - 2026-08-17

### Added

- `.repocare.json` configuration with ignored rules and a default score threshold.
- SARIF 2.1.0 output for GitHub Code Scanning and other compatible consumers.
- JSON Schema for editor validation and completion.
- Action support for configuration files and SARIF reports.

### Changed

- Report schema version is now `2` and records ignored rule IDs.
- Package version is read directly from `package.json` instead of duplicated in source.
- Scores are normalized across active rules when explicitly ignored rules are configured.

### Fixed

- Directories can no longer satisfy file-based rules such as `LICENSE`.
- `.github/ISSUE_TEMPLATE/config.yml` no longer counts as an issue template.
- CI and release automation detection requires stronger workflow evidence.

## [0.1.0] - 2026-08-17

### Added

- Local repository scanner with fifteen health checks and a 100-point score.
- Text, Markdown, and JSON reports.
- Minimum-score enforcement for CI.
- Composite GitHub Action.
- GitHub Actions job summaries and a reusable report-path output.
- Automated tests and open-source community documentation.
- Copy-ready workflow example and detailed rule reference.
