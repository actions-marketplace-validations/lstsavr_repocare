import { readFile } from "node:fs/promises";
import path from "node:path";
import { isFile } from "./fs-utils.js";
import { ruleIds } from "./rules.js";
function validateThreshold(value) {
    if (value === undefined)
        return undefined;
    if (!Number.isInteger(value) || value < 0 || value > 100) {
        throw new Error("Config failUnder must be an integer from 0 to 100");
    }
    return value;
}
export async function loadConfig(target, explicitPath) {
    const root = path.resolve(target);
    const configPath = explicitPath ? path.resolve(explicitPath) : path.join(root, ".repocare.json");
    if (!(await isFile(configPath))) {
        if (explicitPath)
            throw new Error(`Config file not found: ${configPath}`);
        return { ignore: [] };
    }
    let parsed;
    try {
        parsed = JSON.parse(await readFile(configPath, "utf8"));
    }
    catch (error) {
        throw new Error(`Invalid RepoCare config at ${configPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("RepoCare config must be a JSON object");
    }
    const object = parsed;
    const supportedKeys = new Set(["$schema", "ignore", "failUnder"]);
    const unknownKeys = Object.keys(object).filter((key) => !supportedKeys.has(key));
    if (unknownKeys.length > 0)
        throw new Error(`Unknown RepoCare config option: ${unknownKeys.join(", ")}`);
    const ignore = object.ignore ?? [];
    if (!Array.isArray(ignore) || ignore.some((value) => typeof value !== "string")) {
        throw new Error("Config ignore must be an array of rule IDs");
    }
    const uniqueIgnore = [...new Set(ignore)];
    const unknownRules = uniqueIgnore.filter((id) => !ruleIds.includes(id));
    if (unknownRules.length > 0)
        throw new Error(`Unknown RepoCare rule ID: ${unknownRules.join(", ")}`);
    if (uniqueIgnore.length === ruleIds.length)
        throw new Error("Config cannot ignore every RepoCare rule");
    return {
        ignore: uniqueIgnore,
        failUnder: validateThreshold(object.failUnder),
        source: configPath,
    };
}
//# sourceMappingURL=config.js.map