import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { parseArguments, run } from "../src/cli.js";

test("parses scan options", () => {
  assert.deepEqual(parseArguments(["scan", "demo", "--format", "json", "--fail-under", "80"]), {
    target: "demo",
    format: "json",
    failUnder: 80,
  });
});

test("rejects invalid thresholds", () => {
  assert.throws(() => parseArguments(["scan", "--fail-under", "101"]), /integer from 0 to 100/);
});

test("creates parent directories for report output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "repocare-cli-test-"));
  const output = path.join(root, "artifacts", "report.json");
  const originalWrite = process.stdout.write;
  process.stdout.write = (() => true) as typeof process.stdout.write;
  try {
    assert.equal(await run(["scan", root, "--format", "json", "--output", output]), 0);
    const report = JSON.parse(await readFile(output, "utf8")) as { repository: string; schemaVersion: number };
    assert.equal(report.repository, root);
    assert.equal(report.schemaVersion, 1);
  } finally {
    process.stdout.write = originalWrite;
    await rm(root, { recursive: true, force: true });
  }
});
