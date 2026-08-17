import assert from "node:assert/strict";
import { test } from "node:test";
import { renderMarkdown, renderReport, renderSarif, renderText } from "../src/reporters.js";
import type { ScanReport } from "../src/types.js";

const report: ScanReport = {
  schemaVersion: 2,
  toolVersion: "0.2.0",
  repository: "/demo",
  scannedAt: "2026-01-01T00:00:00.000Z",
  score: 50,
  grade: "F",
  summary: { passed: 0, warned: 1, failed: 0, total: 1 },
  ignoredRules: [],
  rules: [
    {
      id: "demo",
      title: "Demo | check",
      status: "warn",
      weight: 10,
      earned: 5,
      evidence: "Partial",
      recommendation: "Finish it",
    },
  ],
};

test("text reports contain the score and recommendation", () => {
  const rendered = renderText(report);
  assert.match(rendered, /50\/100/);
  assert.match(rendered, /Next: Finish it/);
});

test("markdown reports escape table pipes", () => {
  const rendered = renderMarkdown(report);
  assert.match(rendered, /Demo \\| check/);
});

test("json reports preserve the schema", () => {
  const parsed = JSON.parse(renderReport(report, "json")) as ScanReport;
  assert.equal(parsed.schemaVersion, 2);
  assert.equal(parsed.rules[0]?.id, "demo");
});

test("SARIF reports expose non-passing rules", () => {
  const parsed = JSON.parse(renderSarif(report)) as {
    version: string;
    runs: Array<{ results: Array<{ ruleId: string; level: string }> }>;
  };
  assert.equal(parsed.version, "2.1.0");
  assert.deepEqual(parsed.runs[0]?.results, [{
    ruleId: "demo",
    level: "warning",
    message: { text: "Partial. Finish it" },
  }]);
});
