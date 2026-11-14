import type { GraphNode } from "../types/graph.js";


export function startsInPublic(route: string[], nodesByName: Map<string, GraphNode>): boolean {
    const firstName = route[0]; // the name of the first service in the route

    if (firstName === undefined) { // empty route
        return false;
    }

    const firstNode = nodesByName.get(firstName); //gets the full object of that service

    if (firstNode === undefined) { // no info about this service
        return false;
    }

    return firstNode.publicExposed === true;
}
