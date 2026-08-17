export interface RepoCareConfig {
    ignore: string[];
    failUnder?: number;
    source?: string;
}
export declare function loadConfig(target: string, explicitPath?: string): Promise<RepoCareConfig>;
//# sourceMappingURL=config.d.ts.map