export type RuleStatus = "pass" | "warn" | "fail";
export interface RuleResult {
    id: string;
    title: string;
    status: RuleStatus;
    weight: number;
    earned: number;
    evidence: string;
    recommendation?: string;
}
export interface ScanReport {
    schemaVersion: 1;
    toolVersion: string;
    repository: string;
    scannedAt: string;
    score: number;
    grade: "A" | "B" | "C" | "D" | "F";
    summary: {
        passed: number;
        warned: number;
        failed: number;
        total: number;
    };
    rules: RuleResult[];
}
export interface ScanOptions {
    now?: Date;
}
//# sourceMappingURL=types.d.ts.map