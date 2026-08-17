export declare function isFile(target: string): Promise<boolean>;
export declare function isDirectory(target: string): Promise<boolean>;
export declare function firstExisting(root: string, candidates: string[]): Promise<string | undefined>;
export declare function readText(root: string, relativePath: string): Promise<string | undefined>;
export declare function listFiles(root: string, relativeDirectory: string): Promise<string[]>;
export declare function findTestEvidence(root: string): Promise<string | undefined>;
//# sourceMappingURL=fs-utils.d.ts.map