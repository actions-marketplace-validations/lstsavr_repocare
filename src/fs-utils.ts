import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

export async function isFile(target: string): Promise<boolean> {
  try {
    return (await stat(target)).isFile();
  } catch {
    return false;
  }
}

export async function isDirectory(target: string): Promise<boolean> {
  try {
    return (await stat(target)).isDirectory();
  } catch {
    return false;
  }
}

export async function firstExisting(root: string, candidates: string[]): Promise<string | undefined> {
  for (const candidate of candidates) {
    if (await isFile(path.join(root, candidate))) return candidate;
  }
  return undefined;
}

export async function readText(root: string, relativePath: string): Promise<string | undefined> {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch {
    return undefined;
  }
}

export async function listFiles(root: string, relativeDirectory: string): Promise<string[]> {
  const directory = path.join(root, relativeDirectory);
  if (!(await isDirectory(directory))) return [];
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => `${relativeDirectory.replace(/\\/g, "/").replace(/\/$/, "")}/${entry.name}`);
  } catch {
    return [];
  }
}

export async function findTestEvidence(root: string): Promise<string | undefined> {
  const directories = ["test", "tests", "__tests__", "spec"];
  for (const directory of directories) {
    if (await isDirectory(path.join(root, directory))) return `${directory}/`;
  }

  const entries = await readdir(root, { withFileTypes: true });
  const match = entries.find(
    (entry) => entry.isFile() && /(?:\.test|\.spec)\.(?:[cm]?[jt]sx?|py|rb|go)$/i.test(entry.name),
  );
  return match?.name;
}
