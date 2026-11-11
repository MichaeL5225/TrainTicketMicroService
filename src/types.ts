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

export interface RawGraphEdge {
    from: string;
    to: EdgeTarget;
}

export type EdgeTarget = string | string[];

export interface GraphEdge {
    from: string;
    to: string;
}

export interface RawGraphFile {
    nodes: GraphNode[];
    edges: RawGraphEdge[];
}