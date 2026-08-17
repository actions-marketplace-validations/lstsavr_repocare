#!/usr/bin/env node
import { type OutputFormat } from "./reporters.js";
interface CliOptions {
    target: string;
    format: OutputFormat;
    output?: string;
    failUnder?: number;
    config?: string;
}
export declare function parseArguments(args: string[]): CliOptions | "help" | "version";
export declare function run(args?: string[]): Promise<number>;
export {};
//# sourceMappingURL=cli.d.ts.map