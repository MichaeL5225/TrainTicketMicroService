import type { NodeKind, GraphNode } from "../types/graph.js";                                // the node types

const SINK_KINDS = new Set<NodeKind>(["rds", "sql"]);                                        // the node kinds that count as a sink - change the decision HERE only


export function endsInSink(route: string[], nodesByName: Map<string, GraphNode>): boolean {  // true if the LAST service in the route is a database
    const lastName = route[route.length - 1];                                                // the name of the last service in the route
    if (lastName === undefined) {                                                            // empty route
        return false;                                                                        // an empty route doesn't end anywhere
    }

    const lastNode = nodesByName.get(lastName);                                              // gets the full object of that service from the Map

    if (lastNode === undefined) {                                                            // no info about this service (like assurance-service)
        return false;                                                                        // no evidence it's a sink
    }

    return SINK_KINDS.has(lastNode.kind);                                                    // true if the service's kind is one of the sink kinds
}
