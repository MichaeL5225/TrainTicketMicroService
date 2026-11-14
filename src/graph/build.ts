import type { GraphEdge, GraphNode } from "../types.js";


export function buildAdjacency(edges: GraphEdge[]): Map<string, string[]> {
    const adjacency = new Map<string, string[]>();                                                  // creates a new empty map

    for (const edge of edges) {
        const targets = adjacency.get(edge.from);

        if (targets === undefined) {                                                                // the key "from" is not in the Map yet
            adjacency.set(edge.from, [edge.to]);                                                    // creates a new entry: key = "from", value = a new array with "to" as its first item
        }
        else {
            targets.push(edge.to);                                                                  // adds "to" to the end of an existing list
        }
    }
    return adjacency;
}

export function findEntryPoints(nodes: GraphNode[], edges: GraphEdge[]): string[] {
    const targets = new Set<string>(); // creates an empty set of service names

    for (const edge of edges) {
        targets.add(edge.to); // adds the target to the set (duplicates are ignored automatically)                                              
    }

    const entryPoints: string[] = [];

    for (const node of nodes) { // loops over all nodes      
        if (!targets.has(node.name)) { // this service is NOT in targets = nobody calls it
            entryPoints.push(node.name); // so it's an entry point - add its name to the result
        }
    }

    return entryPoints;
}

export function buildNodeIndex(nodes: GraphNode[]): Map<string, GraphNode> {
    const result = new Map<string, GraphNode>(); // creates a new, empty Map: key = name (string), value = full node (GraphNode)

    for (const node of nodes) {
        result.set(node.name, node); // adds an entry to the Map: key = the service name, value = the whole node object
    }

    return result;
}
