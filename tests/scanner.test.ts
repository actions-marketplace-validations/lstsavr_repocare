import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";
import { scanRepository } from "../src/scanner.js";

const temporaryDirectories: string[] = [];

async function temporaryRepository(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), "repocare-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

async function put(root: string, relativePath: string, content = "test\n"): Promise<void> {
  const target = path.join(root, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

test("an empty repository receives a low score with actionable failures", async () => {
  const root = await temporaryRepository();
  const report = await scanRepository(root, { now: new Date("2026-01-01T00:00:00.000Z") });
  assert.equal(report.schemaVersion, 1);
  assert.ok(report.score < 10);
  assert.equal(report.grade, "F");
  assert.ok(report.rules.some((rule) => rule.id === "readme" && rule.status === "fail"));
});

test("recognizes a quick-start section as installation guidance", async () => {
  const root = await temporaryRepository();
  await put(root, "README.md", "# Demo\n\n## Quick start\n\nRun with npx.\n\n## Usage\n\nScan a repository.\n");
  const report = await scanRepository(root);
  const readme = report.rules.find((rule) => rule.id === "readme");
  assert.equal(readme?.status, "pass");
  assert.equal(readme?.earned, 12);
});

test("a well-maintained repository receives an A", async () => {
  const root = await temporaryRepository();
  await Promise.all([
    put(root, "README.md", "# Demo\n\n## Installation\n\nInstall it.\n\n## Usage\n\nRun it.\n"),
    put(root, "LICENSE"),
    put(root, "CONTRIBUTING.md"),
    put(root, "SECURITY.md"),
    put(root, "CODE_OF_CONDUCT.md"),
    put(root, "CHANGELOG.md"),
    put(root, ".github/ISSUE_TEMPLATE/bug.yml"),
    put(root, ".github/PULL_REQUEST_TEMPLATE.md"),
    put(root, ".github/workflows/ci.yml", "on: [push, pull_request]\njobs:\n  test:\n"),
    put(root, ".github/workflows/release.yml"),
    put(root, ".github/dependabot.yml"),
    put(root, "tests/example.test.ts"),
    put(root, ".gitignore"),
    put(root, ".editorconfig"),
    put(root, "package.json", JSON.stringify({ description: "Demo", license: "MIT", repository: "demo/example" })),
  ]);
  const report = await scanRepository(root);
  assert.equal(report.score, 100);
  assert.equal(report.grade, "A");
  assert.equal(report.summary.failed, 0);
});

test("invalid repository paths produce a useful error", async () => {
  await assert.rejects(() => scanRepository(path.join(os.tmpdir(), "repocare-missing-path")), /not a directory/);
});
