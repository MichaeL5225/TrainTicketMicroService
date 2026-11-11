export interface GraphNode {
    name: string;
    kind: NodeKind;
    language?: string;
    path?: string;
    publicExposed?: boolean;
    vulnerabilities?: Vulnerability[];
    metadata?: Record<string, string>;
}

export type NodeKind = "service" | "rds" | "sqs";

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
    to: EdgeTarget;
}

export type EdgeTarget = string | string[];

export interface GraphFile {
    nodes: GraphNode[];
    edges: GraphEdge[];
}