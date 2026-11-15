
export function findRoutesFrom(start: string, adjacency: Map<string, string[]>): string[][] {  // returns ALL full routes that begin at "start" (DFS)
    const routes: string[][] = [];                                // the basket: every full route we find goes here

    function walk(current: string, path: string[]): void {        // inner recursive function: "current" = where we are, "path" = how we got here
        const targets = adjacency.get(current);                   // asks the map: where does the service I'm standing on go? (string[] or undefined)
        if (targets === undefined) {                              // it calls nobody - a leaf
            routes.push(path);                                    // reached the end: put the full route we walked into the basket
        }
        else {                                                    // it calls one or more services
            for (const next of targets) {                         // loops over every service that "current" calls
                if (!path.includes(next)) {                       // "next" is NOT in the route yet - safe to continue (no cycle)
                    walk(next, [...path, next]);                  // continue from "next", with a NEW array: the path so far + "next"
                }
                else {                                            // "next" is already in THIS route - going there would be a cycle
                    routes.push(path);                            // the route ends here - save it as it is (without "next")
                }
            }
        }
    }

    walk(start, [start]);                                         // starts the walk: we're at "start", and the path so far is just [start]
    return routes;                                                // after all the recursion finishes, returns everything that was collected
}

export function findAllRoutes(entryPoints: string[], adjacency: Map<string, string[]>): string[][] {  // returns every full route in the graph, from every entry point
    const allRoutes: string[][] = [];                             // the big basket for ALL routes from ALL entry points

    for (const start of entryPoints) {                            // loops over the entry points, one at a time
        const routesFromHere = findRoutesFrom(start, adjacency);  // all routes that begin at THIS entry point
        allRoutes.push(...routesFromHere);                        // "..." adds each route separately, not the whole array as one item
    }
    return allRoutes;                                             // 222 in our data
}
