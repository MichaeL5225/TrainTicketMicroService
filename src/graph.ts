import type { GraphEdge, GraphNode, GraphResponse } from "./types.js";     // brings the types used in this file



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

export function routesToGraph(routes: string[][], nodesByName: Map<string, GraphNode>) : GraphResponse {  // turns a list of routes into { nodes, edges } without duplicates
    const nodeNames = new Set<string>();                                                                  // basket 1: every service name we see in the routes (set = no duplicates)
    const edgeKeys = new Set<string>();                                                                   // basket 2: every arrow we see, written as text like "A->B" 
    const edges: GraphEdge[] = [];                                                                        // basket 3: the real arrow objects {from, to} that we'll return

    for (const route of routes) {                                                                         // loops over every route (each route is a list of service names)
        for (let i = 0; i <route.length; i++) {                                                           // loops over the positions in this route: 0, 1, 2...
            const current = route[i];                                                                     // the service name at position i (string or undefined for TS)

            if (current === undefined) {                                                                  // can't really happen here, but TS doesn't know that
                continue;                                                                                 // skip, to satisfy the compiler
            }
            nodeNames.add(current);                                                                       // PART 1: put the name in basket 1 (duplicates are ignored)

            const next = route[i + 1];                                                                    // the service AFTER current in the route (undefined if current is the last one)
            
            if (next === undefined) {                                                                     // current is the last service - there is no arrow after it
                continue;
            }

            const edgeKey = `${current}->${next}`;                                                        // the arrow as text, e.g. "user-service->auth-service"

            if (!edgeKeys.has(edgeKey)) {                                                                 // have we NOT seen this arrow before?
                edgeKeys.add(edgeKey);                                                                    // remember it in basket 2, so next time we'll know it's a duplicate
                edges.push({from: current, to: next});                                                    // put the real arrow object in basket 3
            }
        }
    }

    const nodes: GraphNode[] = [];                                                                        // the full node objects we'll return

    for (const name of nodeNames) {                                                                       // loops over every unique service name we collected
        const node = nodesByName.get(name);                                                               // looks up the full object (or undefined if there's no info)

        if (node === undefined) {                                                                         // a service that edges point to, but isn't defined in the file
            nodes.push({name: name, kind: "unknown"});                                                    // add a minimal "placeholder" node so the arrow has something to point to
        }
        else {
            nodes.push(node);                                                                             // add the full object with all its details
        }
    }

    return {routes: routes, nodes: nodes, edges: edges};                                                  // the routes themselves + the graph built from them
}