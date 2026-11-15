export interface GraphNode {                                           // one node: a service, a database or a queue
    name: string;                                                      // required: the unique name, e.g. "auth-service"
    kind: NodeKind;                                                    // required: what kind of node it is
    language?: string;                                                 // services only: the programming language, e.g. "java"
    path?: string;                                                     // services only: where its code lives in the repo
    publicExposed?: boolean;                                           // services only: can it be reached from the internet?
    vulnerabilities?: Vulnerability[];                                 // only some services: security findings in their code
    metadata?: Record<string, string>;                                 // infrastructure only (rds / sqs): details whose keys differ per node
}

export type NodeKind = "service" | "rds" | "sqs" | "sql" | "unknown";  // "unknown" = a service that edges point to, but has no info in the file


export interface Vulnerability {                                       // one security finding
    file: string;                                                      // the source file where it was found
    severity: string;                                                  // e.g. "medium", "high" - a string, because we don't know the full list of values
    message: string;                                                   // what the scanner found
    metadata: VulnerabilityMetadata;                                   // extra info with a fixed shape
}

export interface VulnerabilityMetadata {                               // the metadata of a vulnerability - always the same key
    cwe: string;                                                       // the weakness category, e.g. "CWE-22: ... Path Traversal"
}

export interface GraphEdge {                                           // one arrow, as the program uses it (after normalization)
    from: string;                                                      // the service that makes the call
    to: string;                                                        // ONE target - one arrow
}
