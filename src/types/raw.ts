import type { GraphNode } from "./graph.js";  // the node type (nodes in the file already match it)


export interface RawGraphEdge {               // one edge exactly as it is in the file (INPUT)
    from: string;                             // the service that makes the call
    to: EdgeTarget;                           // string OR string[] - exactly what the file contains, including the messy case
}

export type EdgeTarget = string | string[];   // usually a list of targets; once (consign-service) a single string

export interface RawGraphFile {               // the whole data file, as it is
    nodes: GraphNode[];                       // all the services, databases and queues
    edges: RawGraphEdge[];                    // who calls whom, before normalization
}
