import path from "node:path";
import { isDirectory } from "./fs-utils.js";
import { evaluateRules, totalRuleWeight } from "./rules.js";
import type { ScanOptions, ScanReport } from "./types.js";

export const VERSION = "0.1.0";

function grade(score: number): ScanReport["grade"] {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export async function scanRepository(target = ".", options: ScanOptions = {}): Promise<ScanReport> {
  const root = path.resolve(target);
  if (!(await isDirectory(root))) throw new Error(`Repository path is not a directory: ${root}`);

  const rules = await evaluateRules(root);
  const earned = rules.reduce((total, rule) => total + rule.earned, 0);
  const score = Math.round((earned / totalRuleWeight) * 100);

  return {
    schemaVersion: 1,
    toolVersion: VERSION,
    repository: root,
    scannedAt: (options.now ?? new Date()).toISOString(),
    score,
    grade: grade(score),
    summary: {
      passed: rules.filter((rule) => rule.status === "pass").length,
      warned: rules.filter((rule) => rule.status === "warn").length,
      failed: rules.filter((rule) => rule.status === "fail").length,
      total: rules.length,
    },
    rules,
  };
}
