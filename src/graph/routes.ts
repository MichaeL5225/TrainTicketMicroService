
export function findRoutesFrom(start: string, adjacency: Map<string, string[]>): string[][] {
    const routes: string[][] = [];

    function walk(current: string, path: string[]): void {
        const targets = adjacency.get(current); // asks the map: where does the service I'm standing on go? (string[] or undefined)
        if (targets === undefined) {
            routes.push(path); // reached the end: put the full route we walked into the basket
        }
        else {
            for (const next of targets) { // loops over every service that "current" calls
                if (!path.includes(next)) { // "next" is NOT in the route yet - safe to continue (no cycle)
                    walk(next, [...path, next]); // continue from "next", with the path so far + "next" at the end
                }
                else {
                    routes.push(path); // cycle detected: the route ends here - save it as it is (without "next")
                }
            }
        }
    }

    walk(start, [start]); // starts the walk: we're at "start", and the path so far is just [start]
    return routes;
}

export function findAllRoutes(entryPoints: string[], adjacency: Map<string, string[]>): string[][] {
    const allRoutes: string[][] = [];

    for (const start of entryPoints) {
        const routesFromHere = findRoutesFrom(start, adjacency); // all routes that begin at THIS entry point
        allRoutes.push(...routesFromHere);
    }
    return allRoutes;
}
