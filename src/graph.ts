import type { GraphEdge, GraphNode  } from "./types.js";



export function buildAdjacency(edges: GraphEdge[]) : Map<string, string[]> {  // gets the one-target edges, returns: service name → list of its targets
    const adjacency = new Map<string,string[]>();                             // creates a new empty map

    for (const edge of edges) {
        const targets = adjacency.get(edge.from);

        if (targets === undefined) {                                          // the key "from" is not in the Map yet
            adjacency.set(edge.from, [edge.to]);                              // creates a new entry: key = "from", value = a new array with "to" as its first item
        }
        else {
            targets.push(edge.to);                                            // adds "to" to the end of an existing list
        }
    }
    return adjacency;
}

export function findRoutesFrom(start: string, adjacency: Map<string, string[]>): string[][]{  // returns ALL full routes that begin at "start"
    const routes: string[][] = [];

    function walk(current: string, path: string[]): void {                                  // inner recursive function: "current" = where we are, "path" = how we got here
        const targets = adjacency.get(current);                                             // asks the map: where does the service I'm standing on go? (string[] or undefined)
        if (targets === undefined) {
            routes.push(path);                                                              // reached the end: put the full route we walked into the basket
        }
        else {
            for (const next of targets) {                                                    // loops over every service that "current" calls
                if (!path.includes(next)){                                                   // "next" is NOT in the route yet - safe to continue (no cycle)
                    walk (next, [...path, next]);                                            // continue from "next", with the path so far + "next" at the end
                }
                else {
                    routes.push(path);                                                       // cycle detected: the route ends here - save it as it is (without "next")
                }
            }                                                    
        }
    }

    walk(start, [start]);                                                                     // starts the walk: we're at "start", and the path so far is just [start]
    return routes;
}


export function findEntryPoints(nodes: GraphNode[], edges: GraphEdge[]): string[] {           // returns the names of all services that nobody calls
    const targets = new Set<string>();                                                        // creates an empty set of service names

    for (const edge of edges) {
        targets.add(edge.to);                                                                  // adds the target to the set (duplicates are ignored automatically)                                              
    }

    const entryPoints: string[] = [];

    for (const node of nodes) {                                                                 // loops over all nodes      
        if (!targets.has(node.name)) {                                                          // this service is NOT in targets = nobody calls it
            entryPoints.push(node.name);                                                        // so it's an entry point - add its name to the result
        }
    }

    return entryPoints;
}


export function findAllRoutes(entryPoints: string[], adjacency: Map<string, string[]>): string[][] {    // returns every full route in the graph, from every entry point
    const allRoutes: string[][] = [];

    for (const start of entryPoints) {
        const routesFromHere = findRoutesFrom(start,adjacency);                                         // all routes that begin at THIS entry point
        allRoutes.push(...routesFromHere);
    }
    return allRoutes;
}

export function buildNodeIndex(nodes: GraphNode[]): Map<string, GraphNode> {                            // returns a Map: service name → its full GraphNode object
    const result =  new Map<string, GraphNode>();                                                       // creates a new, empty Map: key = name (string), value = full node (GraphNode)

    for (const node of nodes) {
        result.set(node.name, node);                                                                     // adds an entry to the Map: key = the service name, value = the whole node object
    }

    return result;
}