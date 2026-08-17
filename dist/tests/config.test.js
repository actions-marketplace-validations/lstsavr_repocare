import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { loadConfig } from "../src/config.js";
test("loads and validates repository config", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "repocare-config-test-"));
    try {
        await writeFile(path.join(root, ".repocare.json"), JSON.stringify({ ignore: ["changelog"], failUnder: 82 }));
        const config = await loadConfig(root);
        assert.deepEqual(config.ignore, ["changelog"]);
        assert.equal(config.failUnder, 82);
        assert.equal(config.source, path.join(root, ".repocare.json"));
    }
    finally {
        await rm(root, { recursive: true, force: true });
    }
});
test("rejects unknown config options and rule IDs", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "repocare-config-test-"));
    try {
        const configPath = path.join(root, ".repocare.json");
        await writeFile(configPath, JSON.stringify({ ignored: ["license"] }));
        await assert.rejects(() => loadConfig(root), /Unknown RepoCare config option/);
        await writeFile(configPath, JSON.stringify({ ignore: ["made_up_rule"] }));
        await assert.rejects(() => loadConfig(root), /Unknown RepoCare rule ID/);
    }
    finally {
        await rm(root, { recursive: true, force: true });
    }
});
//# sourceMappingURL=config.test.js.map