# RepoCare rules

RepoCare 0.1 evaluates fifteen repository signals. The weights total 100 points, so the weighted result is also the repository health score.

| Rule | Weight | Passing evidence |
| --- | ---: | --- |
| README quality | 12 | A README with clearly labeled installation and usage guidance |
| Open-source license | 10 | A conventional license or copying file |
| Contribution guide | 8 | `CONTRIBUTING.md` in the root, `.github`, or `docs` |
| Security policy | 8 | `SECURITY.md` in the root, `.github`, or `docs` |
| Issue templates | 7 | At least one file in `.github/ISSUE_TEMPLATE` |
| Code of conduct | 5 | A conventional code-of-conduct file |
| Changelog | 5 | A changelog, history, changes, or news file |
| Pull request template | 5 | A conventional pull request template |
| Continuous integration | 10 | A GitHub workflow that runs build, test, or checks on changes |
| Automated tests | 10 | A conventional test directory or root-level test file |
| Dependency updates | 5 | Dependabot or Renovate configuration |
| Release automation | 5 | A release- or publish-named GitHub workflow |
| Git ignore rules | 3 | `.gitignore` |
| Editor configuration | 2 | `.editorconfig` |
| Package metadata | 5 | Recognized ecosystem metadata; npm projects need description, license, and repository |

## Status and scoring

- **Pass** receives the rule's full weight.
- **Warn** receives partial credit when useful evidence exists but needs improvement.
- **Fail** receives no credit and includes a recommended next action.

Grades are A (90–100), B (80–89), C (70–79), D (60–69), and F (below 60).

RepoCare deliberately checks repository evidence rather than claiming to measure code quality, security, maintainer responsiveness, or community health. Treat the score as a practical checklist, not a certification.

