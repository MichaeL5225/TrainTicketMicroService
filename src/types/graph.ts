export interface GraphNode {
    name: string;
    kind: NodeKind;
    language?: string;
    path?: string;
    publicExposed?: boolean;
    vulnerabilities?: Vulnerability[];
    metadata?: Record<string, string>;
}

export type NodeKind = "service" | "rds" | "sqs" | "sql" | "unknown"; // "unknown" = a service that edges point to, but has no info in the file


export interface Vulnerability {
    file: string;
    severity: string;
    message: string;
    metadata: VulnerabilityMetadata;
}

export interface VulnerabilityMetadata {
    cwe: string;
}

export interface GraphEdge {
    from: string;
    to: string; // ONE target - one arrow
}
