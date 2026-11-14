import { UnknownFilterError } from "../errors/UnknownFilterError.js";
import { FILTERS } from "./registry.js";
import type { RouteFilter } from "../types/filters.js";
import type { GraphNode } from "../types/graph.js";

function passesAllFilters(route: string[], routeFilters: RouteFilter[], nodesByName: Map<string, GraphNode>): boolean {
    for (const routeFilter of routeFilters) { // loops over the filter functions, one at a time
        if (routeFilter(route, nodesByName) === false) { // runs the filter on this route - did it fail? 
            return false; // one failed filter is enough to reject the route - stop checking
        }
    }

    return true; // no filter failed - the route passes them all
}

export function applyFilters(routes: string[][], filterNames: string[], nodesByName: Map<string, GraphNode>): string[][] {
    const selectedFilters: RouteFilter[] = []; // an empty array that will hold filter FUNCTIONS

    for (const name of filterNames) { // loops over the names that came from the URL (e.g. "sink", "vulnerable")                                                                                      
        const routeFilter = FILTERS.get(name); // looks up the function by its name - only names we registered (RouteFilter or undefined)
        if (routeFilter === undefined) {
            throw new UnknownFilterError(`Unknown filter: ${name}`); // stops everything and reports which name was wrong
        }

        selectedFilters.push(routeFilter); // the name exists - add its function to the array
    }

    return routes.filter(route => passesAllFilters(route, selectedFilters, nodesByName)); // keeps only the routes that pass every filter
}
