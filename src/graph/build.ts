import type { GraphEdge, GraphNode } from "../types/graph.js";                       // the types of one edge and one node


export function buildAdjacency(edges: GraphEdge[]): Map<string, string[]> {          // builds the Map: service name → the services it calls
    const adjacency = new Map<string, string[]>();                                   // creates a new empty map

    for (const edge of edges) {                                                      // loops over all one-target edges
        const targets = adjacency.get(edge.from);                                    // the list collected so far for "from" (or undefined)

        if (targets === undefined) {                                                 // the key "from" is not in the Map yet
            adjacency.set(edge.from, [edge.to]);                                     // creates a new entry: key = "from", value = a new array with "to" as its first item
        }
        else {                                                                       // "from" already has a list
            targets.push(edge.to);                                                   // adds "to" to the end of the existing list
        }
    }
    return adjacency;                                                                // e.g. "auth-service" → ["verification-code-service", "prod-postgresdb"]
}

export function findEntryPoints(nodes: GraphNode[], edges: GraphEdge[]): string[] {  // returns the names of all services that nobody calls
    const targets = new Set<string>();                                               // creates an empty set of service names

    for (const edge of edges) {                                                      // loops over all edges
        targets.add(edge.to);                                                        // adds the target to the set (duplicates are ignored automatically)
    }

    const entryPoints: string[] = [];                                                // the result: names of services nobody calls

    for (const node of nodes) {                                                      // loops over all nodes
        if (!targets.has(node.name)) {                                               // this service is NOT in targets = nobody calls it
            entryPoints.push(node.name);                                             // so it's an entry point - add its name to the result
        }
    }

    return entryPoints;                                                              // 18 in our data
}

export function buildNodeIndex(nodes: GraphNode[]): Map<string, GraphNode> {         // builds the Map: service name → its full node object
    const result = new Map<string, GraphNode>();                                     // creates a new, empty Map: key = name (string), value = full node (GraphNode)

    for (const node of nodes) {                                                      // loops over all nodes from the file
        result.set(node.name, node);                                                 // adds an entry to the Map: key = the service name, value = the whole node object
    }

    return result;                                                                   // lookups by name are now instant
}
