import type { GraphNode } from "./graph.js";


export interface RawGraphEdge {
    from: string;
    to: EdgeTarget; // string OR string[] - exactly what the file contains, including the messy case
}

export type EdgeTarget = string | string[];

export interface RawGraphFile {
    nodes: GraphNode[];
    edges: RawGraphEdge[];
}
