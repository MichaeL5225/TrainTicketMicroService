import type { GraphEdge } from "./types.js";



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