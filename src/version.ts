import { readFileSync } from "node:fs";

interface PackageManifest {
  version?: unknown;
}

const manifest = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
) as PackageManifest;

if (typeof manifest.version !== "string" || !manifest.version) {
  throw new Error("RepoCare package version is missing");
}

export const VERSION = manifest.version;

