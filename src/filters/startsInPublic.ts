import type { GraphNode } from "../types/graph.js";  // the node type


export function startsInPublic(route: string[], nodesByName: Map<string, GraphNode>): boolean {  // true if the FIRST service in the route is publicly exposed
    const firstName = route[0];                      // the name of the first service in the route

    if (firstName === undefined) {                   // empty route
        return false;                                // an empty route doesn't start anywhere
    }

    const firstNode = nodesByName.get(firstName);    // gets the full object of that service from the Map

    if (firstNode === undefined) {                   // no info about this service
        return false;                                // no evidence it's public
    }

    return firstNode.publicExposed === true;         // true ONLY if publicExposed is exactly true (not false, not missing)
}
