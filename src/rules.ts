import path from "node:path";
import { exists, findTestEvidence, firstExisting, listFiles, readText } from "./fs-utils.js";
import type { RuleResult, RuleStatus } from "./types.js";

interface RuleDefinition {
  id: string;
  title: string;
  weight: number;
  evaluate(root: string): Promise<Omit<RuleResult, "id" | "title" | "weight">>;
}

function result(
  status: RuleStatus,
  earned: number,
  evidence: string,
  recommendation?: string,
): Omit<RuleResult, "id" | "title" | "weight"> {
  return { status, earned, evidence, recommendation };
}

function fileRule(
  id: string,
  title: string,
  weight: number,
  candidates: string[],
  recommendation: string,
): RuleDefinition {
  return {
    id,
    title,
    weight,
    async evaluate(root) {
      const found = await firstExisting(root, candidates);
      return found ? result("pass", weight, found) : result("fail", 0, "Not found", recommendation);
    },
  };
}

const rules: RuleDefinition[] = [
  {
    id: "readme",
    title: "README quality",
    weight: 12,
    async evaluate(root) {
      const readme = await firstExisting(root, ["README.md", "README.rst", "README.txt", "README"]);
      if (!readme) return result("fail", 0, "Not found", "Add a README with installation and usage instructions.");
      const text = (await readText(root, readme)) ?? "";
      const hasInstall = /(?:^|\n)#{1,4}\s+(?:install|installation|getting started|quick start)/i.test(text);
      const hasUsage = /(?:^|\n)#{1,4}\s+(?:usage|quickstart|examples?)/i.test(text);
      if (hasInstall && hasUsage) return result("pass", 12, `${readme} includes installation and usage guidance`);
      return result("warn", 6, readme, "Add clearly labeled installation and usage sections.");
    },
  },
  fileRule("license", "Open-source license", 10, ["LICENSE", "LICENSE.md", "LICENSE.txt", "COPYING"], "Add an OSI-approved license file."),
  fileRule(
    "contributing",
    "Contribution guide",
    8,
    ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "docs/CONTRIBUTING.md"],
    "Document how contributors can set up, test, and submit changes.",
  ),
  fileRule(
    "security",
    "Security policy",
    8,
    ["SECURITY.md", ".github/SECURITY.md", "docs/SECURITY.md"],
    "Add a SECURITY.md with a private vulnerability reporting path.",
  ),
  fileRule(
    "code_of_conduct",
    "Code of conduct",
    5,
    ["CODE_OF_CONDUCT.md", ".github/CODE_OF_CONDUCT.md"],
    "Add a code of conduct for community participation.",
  ),
  fileRule(
    "changelog",
    "Changelog",
    5,
    ["CHANGELOG.md", "CHANGES.md", "HISTORY.md", "NEWS.md"],
    "Track user-visible changes in a changelog.",
  ),
  {
    id: "issue_templates",
    title: "Issue templates",
    weight: 7,
    async evaluate(root) {
      const files = await listFiles(root, ".github/ISSUE_TEMPLATE");
      return files.length > 0
        ? result("pass", 7, files.join(", "))
        : result("fail", 0, "Not found", "Add bug report and feature request issue templates.");
    },
  },
  fileRule(
    "pull_request_template",
    "Pull request template",
    5,
    [".github/PULL_REQUEST_TEMPLATE.md", "PULL_REQUEST_TEMPLATE.md", "docs/PULL_REQUEST_TEMPLATE.md"],
    "Add a pull request checklist covering tests and documentation.",
  ),
  {
    id: "continuous_integration",
    title: "Continuous integration",
    weight: 10,
    async evaluate(root) {
      const files = await listFiles(root, ".github/workflows");
      const candidates = files.filter((file) => /\.(?:yml|yaml)$/i.test(file));
      for (const file of candidates) {
        const text = (await readText(root, file)) ?? "";
        const runsForChanges = /pull_request\s*:|push\s*:|\bon\s*:\s*\[[^\]]*(?:push|pull_request)/i.test(text);
        if (runsForChanges && /(?:test|check|build)/i.test(text)) {
          return result("pass", 10, file);
        }
      }
      return result("fail", 0, "No CI workflow detected", "Run build and tests for pushes and pull requests.");
    },
  },
  {
    id: "tests",
    title: "Automated tests",
    weight: 10,
    async evaluate(root) {
      const evidence = await findTestEvidence(root);
      return evidence
        ? result("pass", 10, evidence)
        : result("fail", 0, "Not found", "Add an automated test suite for core behavior.");
    },
  },
  {
    id: "dependency_updates",
    title: "Dependency update automation",
    weight: 5,
    async evaluate(root) {
      const found = await firstExisting(root, [".github/dependabot.yml", "renovate.json", "renovate.json5", ".renovaterc"]);
      return found
        ? result("pass", 5, found)
        : result("fail", 0, "Not found", "Configure Dependabot or Renovate.");
    },
  },
  {
    id: "release_automation",
    title: "Release automation",
    weight: 5,
    async evaluate(root) {
      const files = await listFiles(root, ".github/workflows");
      const found = files.find((file) => /(?:release|publish)/i.test(path.basename(file)));
      return found
        ? result("pass", 5, found)
        : result("fail", 0, "Not found", "Add a repeatable release or package publishing workflow.");
    },
  },
  fileRule("gitignore", "Git ignore rules", 3, [".gitignore"], "Add a .gitignore for generated files and local secrets."),
  fileRule("editorconfig", "Editor configuration", 2, [".editorconfig"], "Add an .editorconfig for consistent formatting."),
  {
    id: "package_metadata",
    title: "Package metadata",
    weight: 5,
    async evaluate(root) {
      const manifest = await firstExisting(root, ["package.json", "pyproject.toml", "Cargo.toml", "go.mod"]);
      if (!manifest) return result("warn", 2, "No recognized package manifest", "Add project metadata for your ecosystem.");
      if (manifest !== "package.json") return result("pass", 5, manifest);
      try {
        const parsed = JSON.parse((await readText(root, manifest)) ?? "{}") as Record<string, unknown>;
        const fields = ["description", "license", "repository"].filter((key) => Boolean(parsed[key]));
        if (fields.length === 3) return result("pass", 5, `${manifest}: description, license, repository`);
        return result("warn", Math.max(2, fields.length), `${manifest}: ${fields.join(", ") || "basic fields only"}`, "Add description, license, and repository metadata.");
      } catch {
        return result("fail", 0, `${manifest} is not valid JSON`, "Fix the package manifest syntax.");
      }
    },
  },
];

export async function evaluateRules(root: string): Promise<RuleResult[]> {
  return Promise.all(
    rules.map(async (rule) => ({
      id: rule.id,
      title: rule.title,
      weight: rule.weight,
      ...(await rule.evaluate(root)),
    })),
  );
}

export const totalRuleWeight = rules.reduce((total, rule) => total + rule.weight, 0);
