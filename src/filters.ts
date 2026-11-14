import type { GraphNode, NodeKind, RouteFilter } from "./types.js";

const SINK_KINDS = new Set<NodeKind>(["rds", "sql"]);                                        // the node kinds that count as a sink - change the decision HERE only

export function endsInSink(route: string[], nodesByName: Map<string, GraphNode>) : boolean { // true if the LAST service in the route is a database
    const lastName = route[route.length - 1];                                                // the name of the last service in the route
    if (lastName === undefined) {                                                            //empty route
        return false;
    }

    const lastNode = nodesByName.get(lastName);                                              // gets the full object of that service from the Map

    if (lastNode === undefined) {                                                            // no info about this service
        return false;                                                                        // no evidence it's a sink
    }

    return SINK_KINDS.has(lastNode.kind);                                                     // true if the service's kind is one of the sink kinds
}


export function startsInPublic(route: string[], nodesByName: Map<string, GraphNode>) : boolean {  // true if the first service in the route is publicExposed ==  true
    const firstName = route[0];                                                                   // the name of the first service in the route

    if (firstName === undefined) {                                                                // empty route
        return false;
    }

    const firstNode = nodesByName.get(firstName);                                                 //gets the full object of that sertvice

    if (firstNode === undefined) {                                                                // no info about this service
        return false;
    }

    return firstNode.publicExposed === true;
}

export function hasVulnerability(route: string[], nodesByName: Map<string, GraphNode>) : boolean { //true if the services in the route has vulnerabilities
    
    for (const service of route) {                                                                 // loops over every service name in the route
        const node = nodesByName.get(service);
        if (node === undefined) {                                                                  // no info about this service
            continue;                                                                              // skip it, check the next service in the route
        }

        if (node.vulnerabilities !== undefined && node.vulnerabilities.length > 0) {               //the field exists AND has at least one item
            return true;
        }
    }

    return false;
}

function passesAllFilters(route: string[], routeFilters: RouteFilter[], nodesByName: Map<string, GraphNode>) : boolean { // true only if the route passes EVERY filter in the list
    for (const routeFilter of routeFilters) {                                                                                 // loops over the filter functions, one at a time
        if (routeFilter(route, nodesByName) === false) {                                                                 // runs the filter on this route - did it fail? 
            return false;                                                                                           // one failed filter is enough to reject the route - stop checking
        }
    }

    return true;                                                                                                     // no filter failed - the route passes them all
}

export class UnknownFilterError extends Error{}                                                                              // our own error type, meaning "the user asked for a filter that doesn't exist"

export function applyFilters(routes: string[][], filterNames: string[], nodesByName: Map<string, GraphNode>) : string[][] {  // keeps only the routes that pass all the named filters
    const selectedFilters: RouteFilter[] = [];                                                                                      // an empty array that will hold filter FUNCTIONS
    
    for (const name of filterNames) {                                                                                            // loops over the names that came from the URL (e.g. "sink", "vulnerable")                                                                                      
        const routeFilter = FILTERS[name];                                                                                       // looks up the function by its name (RouteFilter or undefined)
        
        if (routeFilter === undefined) {
            throw new UnknownFilterError (`Unknown filter: ${name}`);                                                                         // stops everything and reports which name was wrong
        }
        
        selectedFilters.push(routeFilter);                                                                                       // the name exists - add its function to the array
    }

    return routes.filter(route => passesAllFilters(route, selectedFilters, nodesByName));                                        // keeps only the routes that pass every filter
}


export const FILTERS: Record<string, RouteFilter> = {                                              // the list of all available filters: name in the URL → filter function
    sink: endsInSink,                                                                              // ?filters=sink        → routes that end in a database
    public: startsInPublic,                                                                        // ?filters=public      → routes that start at a public service
    vulnerable: hasVulnerability,                                                                  // ?filters=vulnerable  → routes that pass through a vulnerable service
};