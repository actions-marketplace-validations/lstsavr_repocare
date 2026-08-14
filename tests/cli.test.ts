import assert from "node:assert/strict";
import { test } from "node:test";
import { parseArguments } from "../src/cli.js";

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
