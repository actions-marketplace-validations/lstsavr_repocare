# RepoCare

RepoCare is a local-first repository health scanner for open-source maintainers. It turns common maintenance gaps into a scored, actionable report without uploading source code or requiring an API key.

> Status: early development (`0.1.0`). The report schema and checks may evolve before `1.0`.

## Why RepoCare?

Healthy repositories need more than working code. Contributors need setup instructions, security contacts, issue templates, tests, CI, and a predictable release path. RepoCare checks those signals in seconds and explains the next useful improvement.

## Installation

Requires Node.js 20 or newer.

```bash
npx repocare scan .
```

For development from a clone:

```bash
npm install
npm run build
node dist/src/cli.js scan .
```

## Usage

Print a readable terminal report:

```bash
repocare scan .
```

Generate Markdown for an issue, pull request, or build artifact:

```bash
repocare scan . --format markdown --output repocare-report.md
```

Produce machine-readable JSON and enforce a minimum score:

```bash
repocare scan . --format json --fail-under 80
```

Exit codes are `0` for success, `1` for invalid input or runtime errors, and `2` when `--fail-under` is not met.

## GitHub Action

After this repository is published, pin the action to a released tag:

```yaml
name: Repository health
on:
  pull_request:
  workflow_dispatch:

jobs:
  repocare:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lstsavr/repocare@v0.1.0
        with:
          fail-under: 80
```

The action writes `repocare-report.md` in the workspace. Upload or comment it using the workflow mechanism that fits your repository permissions.

## Checks

RepoCare `0.1.0` scores fifteen signals totaling 100 points:

- README installation and usage guidance
- Open-source license
- Contribution and security documentation
- Code of conduct and changelog
- Issue and pull request templates
- Continuous integration and automated tests
- Dependency update and release automation
- `.gitignore`, `.editorconfig`, and ecosystem metadata

The scanner reads repository files only. It does not call GitHub or any AI service.

## Roadmap

- Configurable rules and ignored checks
- Monorepo and additional ecosystem awareness
- SARIF and GitHub Job Summary output
- Historical score tracking
- Optional maintainer automation adapters with explicit data controls

See [CONTRIBUTING.md](CONTRIBUTING.md) to help shape the roadmap.

## License

MIT © RepoCare contributors.
