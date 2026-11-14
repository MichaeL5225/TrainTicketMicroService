import type { GraphNode, GraphEdge } from "./graph.js";


export interface GraphResponse {
    routes: string[][]; // the routes that passed the filters - each one is a list of service names, in order
    nodes: GraphNode[]; // every service that appears in the routes - each one once
    edges: GraphEdge[]; // every arrow that appears in the routes - each one once
}
