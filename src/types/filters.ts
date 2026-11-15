import type { GraphNode } from "./graph.js";                                                  // the node type


export type RouteFilter = (route: string[], nodesByName: Map<string, GraphNode>) => boolean;  // any function that gets a route + the node map, and returns true/false
