import type { ScanReport } from "./types.js";
export type OutputFormat = "text" | "markdown" | "json" | "sarif";
export declare function renderText(report: ScanReport): string;
export declare function renderMarkdown(report: ScanReport): string;
export declare function renderSarif(report: ScanReport): string;
export declare function renderReport(report: ScanReport, format: OutputFormat): string;
//# sourceMappingURL=reporters.d.ts.map