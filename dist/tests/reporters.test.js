import assert from "node:assert/strict";
import { test } from "node:test";
import { renderMarkdown, renderReport, renderText } from "../src/reporters.js";
const report = {
    schemaVersion: 1,
    toolVersion: "0.1.0",
    repository: "/demo",
    scannedAt: "2026-01-01T00:00:00.000Z",
    score: 50,
    grade: "F",
    summary: { passed: 0, warned: 1, failed: 0, total: 1 },
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
    const parsed = JSON.parse(renderReport(report, "json"));
    assert.equal(parsed.schemaVersion, 1);
    assert.equal(parsed.rules[0]?.id, "demo");
});
//# sourceMappingURL=reporters.test.js.map