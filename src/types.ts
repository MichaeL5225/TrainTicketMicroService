export interface GraphNode {
    name: string;
    kind: NodeKind;
    language?: string;
    path?: string;
    publicExposed?: boolean;
    vulnerabilities?: Vulnerability[];
    metadata?: Record<string, string>;
}

export type NodeKind = "service" | "rds" | "sqs" | "sql" | "unknown";   // "unknown" = a service that edges point to, but has no info in the file

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

export type RouteFilter = (route: string[], nodesByName: Map<string, GraphNode>) => boolean; // any function that gets a route + the node map, and returns true/false

export interface GraphResponse {                                                              // what the API returns: a graph that a client can draw
    nodes: GraphNode[];                                                                       // every service that appears in the routes - each one once
    edges: GraphEdge[];                                                                       // every arrow that appears in the routes - each one once
}