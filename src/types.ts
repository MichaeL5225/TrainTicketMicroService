export interface GraphNode {
    name: string;
    kind: NodeKind;
    language?: string;
    path?: string;
    publicExposed?: boolean;
    vulnerabilities?: Vulnerability[];
    metadata?: Record<string, string>;
}

export type NodeKind = "service" | "rds" | "sqs" | "sql";

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
    to: EdgeTarget;       // string OR string[] - exactly what the file contains, including the messy case
}

export type EdgeTarget = string | string[];

export interface GraphEdge {
    from: string;
    to: string;           // ONE target - one arrow
}

export interface RawGraphFile {
    nodes: GraphNode[];
    edges: RawGraphEdge[];
}