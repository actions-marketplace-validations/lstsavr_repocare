#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadConfig } from "./config.js";
import { scanRepository, VERSION } from "./scanner.js";
import { renderReport } from "./reporters.js";
const HELP = `RepoCare ${VERSION} - repository health checks for open-source maintainers

Usage:
  repocare scan [path] [options]
  repocare --help
  repocare --version

Options:
  --format <text|markdown|json|sarif>  Report format (default: text)
  --output <file>                Write the report to a file
  --fail-under <0-100>           Exit with code 2 when the score is lower
  --config <file>                Use a config file (default: <path>/.repocare.json)
  -h, --help                     Show help
  -v, --version                  Show version
`;
function requireValue(args, index, flag) {
    const value = args[index + 1];
    if (!value || value.startsWith("-"))
        throw new Error(`${flag} requires a value`);
    return value;
}
export function parseArguments(args) {
    if (args.length === 0 || args.includes("--help") || args.includes("-h"))
        return "help";
    if (args.includes("--version") || args.includes("-v"))
        return "version";
    if (args[0] !== "scan")
        throw new Error(`Unknown command: ${args[0]}`);
    const options = { target: ".", format: "text" };
    let targetSet = false;
    for (let index = 1; index < args.length; index += 1) {
        const argument = args[index];
        if (argument === "--format") {
            const value = requireValue(args, index, argument);
            if (!["text", "markdown", "json", "sarif"].includes(value))
                throw new Error(`Unsupported format: ${value}`);
            options.format = value;
            index += 1;
        }
        else if (argument === "--output") {
            options.output = requireValue(args, index, argument);
            index += 1;
        }
        else if (argument === "--fail-under") {
            const raw = requireValue(args, index, argument);
            const threshold = Number(raw);
            if (!Number.isInteger(threshold) || threshold < 0 || threshold > 100)
                throw new Error("--fail-under must be an integer from 0 to 100");
            options.failUnder = threshold;
            index += 1;
        }
        else if (argument === "--config") {
            options.config = requireValue(args, index, argument);
            index += 1;
        }
        else if (argument.startsWith("-")) {
            throw new Error(`Unknown option: ${argument}`);
        }
        else if (!targetSet) {
            options.target = argument;
            targetSet = true;
        }
        else {
            throw new Error(`Unexpected argument: ${argument}`);
        }
    }
    return options;
}
export async function run(args = process.argv.slice(2)) {
    try {
        const parsed = parseArguments(args);
        if (parsed === "help") {
            process.stdout.write(HELP);
            return 0;
        }
        if (parsed === "version") {
            process.stdout.write(`${VERSION}\n`);
            return 0;
        }
        const config = await loadConfig(parsed.target, parsed.config);
        const report = await scanRepository(parsed.target, { ignoreRules: config.ignore });
        const output = renderReport(report, parsed.format);
        if (parsed.output) {
            const outputPath = path.resolve(parsed.output);
            await mkdir(path.dirname(outputPath), { recursive: true });
            await writeFile(outputPath, output, "utf8");
            process.stdout.write(`RepoCare report written to ${parsed.output} (${report.score}/100)\n`);
        }
        else {
            process.stdout.write(output);
        }
        const failUnder = parsed.failUnder ?? config.failUnder;
        return failUnder !== undefined && report.score < failUnder ? 2 : 0;
    }
    catch (error) {
        process.stderr.write(`repocare: ${error instanceof Error ? error.message : String(error)}\n`);
        return 1;
    }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    process.exitCode = await run();
}
//# sourceMappingURL=cli.js.map