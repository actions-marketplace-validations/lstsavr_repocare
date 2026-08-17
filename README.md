# RepoCare

[![CI](https://github.com/lstsavr/repocare/actions/workflows/ci.yml/badge.svg)](https://github.com/lstsavr/repocare/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/repocare.svg)](https://www.npmjs.com/package/repocare)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

RepoCare is a fast, local-first repository health scanner for open-source maintainers. It turns common maintenance gaps into a transparent 100-point report without uploading source code, requiring an API key, or installing runtime dependencies.

```text
RepoCare 0.1.0
Health score: 86/100 (B)
Checks: 12 passed, 2 warnings, 1 failed

[PASS] Open-source license (10/10) - LICENSE
[WARN] README quality (6/12) - README.md
       Next: Add clearly labeled installation and usage sections.
[FAIL] Security policy (0/8) - Not found
       Next: Add a SECURITY.md with a private vulnerability reporting path.
```

## Why RepoCare

Working code is only part of a healthy open-source project. Contributors also need setup instructions, a security contact, issue templates, tests, CI, and a predictable release path. RepoCare checks those signals in seconds and explains the next useful improvement.

- **Local by default:** repository contents never leave the machine.
- **Deterministic:** the same files produce the same score; no AI judgment is involved.
- **Actionable:** every incomplete check includes concrete remediation.
- **CI friendly:** enforce a minimum score with a documented exit code.
- **Portable:** run it with `npx`, install it globally, or use the GitHub Action.

RepoCare is a practical maintenance checklist, not a security audit or quality certification.

## Quick start

RepoCare requires Node.js 20 or newer. No installation is required:

```bash
npx repocare scan .
```

Or install it globally:

```bash
npm install --global repocare
repocare scan .
```

## Usage

```text
Usage:
  repocare scan [path] [options]
  repocare --help
  repocare --version

Options:
  --format <text|markdown|json>  Report format (default: text)
  --output <file>                Write the report to a file
  --fail-under <0-100>           Exit with code 2 when the score is lower
```

Write a Markdown report, creating parent directories when necessary:

```bash
repocare scan . --format markdown --output artifacts/repocare-report.md
```

Produce machine-readable JSON and enforce a minimum score:

```bash
repocare scan . --format json --output repocare.json --fail-under 80
```

Exit codes are:

| Code | Meaning |
| ---: | --- |
| `0` | Scan completed and the minimum score was met |
| `1` | Invalid arguments, path, or runtime error |
| `2` | Scan completed but the score was below `--fail-under` |

## GitHub Action

Pin the action to a released version:

```yaml
name: Repository health

on:
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  repocare:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - name: Scan repository health
        id: repocare
        uses: lstsavr/repocare@v0.1.0
        with:
          fail-under: 80
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v6
        with:
          name: repocare-report
          path: ${{ steps.repocare.outputs.report }}
```

The action writes `repocare-report.md`, exposes its path as the `report` output, and adds Markdown reports to the GitHub Actions job summary. See the [complete workflow example](examples/repository-health.yml) for a copy-ready version.

Action inputs:

| Input | Default | Description |
| --- | --- | --- |
| `path` | `.` | Repository path to scan |
| `output` | `repocare-report.md` | Generated report path |
| `format` | `markdown` | `text`, `markdown`, or `json` |
| `fail-under` | `0` | Minimum accepted score |
| `job-summary` | `true` | Add Markdown output to the Actions job summary |

## What it checks

RepoCare 0.1 evaluates fifteen signals totaling 100 points:

- README installation and usage guidance
- Open-source license
- Contribution and security documentation
- Code of conduct and changelog
- Issue and pull request templates
- Continuous integration and automated tests
- Dependency update and release automation
- `.gitignore`, `.editorconfig`, and ecosystem metadata

The complete evidence rules and weights are documented in [docs/rules.md](docs/rules.md). Reports use schema version `1` for machine-readable integrations.

## Privacy and limitations

The scanner reads files under the selected repository path. It does not call GitHub, contact an AI service, execute project code, or inspect Git history. A high score means conventional maintenance evidence exists; it does not prove that the documentation is accurate, the code is secure, or maintainers are responsive.

## Development

```bash
git clone https://github.com/lstsavr/repocare.git
cd repocare
npm install
npm test
npm run scan:self
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for design principles and contribution guidance, [SECURITY.md](SECURITY.md) for private vulnerability reporting, and [docs/release-process.md](docs/release-process.md) for the release checklist.

## Roadmap

- Configurable rules and ignored checks
- Monorepo and additional ecosystem awareness
- SARIF and GitHub Job Summary enhancements
- Historical score tracking
- Optional maintainer automation adapters with explicit data controls

Ideas and focused pull requests are welcome. Please open a feature request before starting a large change.

## License

[MIT](LICENSE) © lstsavr and RepoCare contributors.
