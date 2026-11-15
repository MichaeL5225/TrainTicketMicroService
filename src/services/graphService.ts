import { loadRawGraph } from "../data/loader.js";                                      // reads + validates the data file
import { normalizeEdges } from "../graph/normalize.js";                                // splits edges into one-target pairs
import { buildAdjacency, findEntryPoints, buildNodeIndex } from "../graph/build.js";   // builds the lookup structures
import { findAllRoutes } from "../graph/routes.js";                                    // the DFS
import { routesToGraph } from "../graph/response.js";                                  // routes → { routes, nodes, edges }
import { applyFilters } from "../filters/applyFilters.js";                             // the generic filtering
import { FILTERS } from "../filters/registry.js";                                      // the list of filters
import type { GraphNode } from "../types/graph.js";                                    // node type - for the field below
import type { GraphResponse } from "../types/api.js";                                  // the type of the answer


export class GraphService {                                                            // all graph logic in one place - knows nothing about HTTP
    private readonly allRoutes: string[][];                                            // every full route - computed once in the constructor, never changes
    private readonly nodesByName: Map<string, GraphNode>;                              // name → full node - computed once, never changes

    constructor(dataFilePath: string) {                                                // runs ONCE when we do "new GraphService(...)"
        const graph = loadRawGraph(dataFilePath);                                      // 1. read the file
        const edges = normalizeEdges(graph.edges);                                     // 2. split edges into one-target pairs
        const adjacency = buildAdjacency(edges);                                       // 3. build the Map: service → its targets
        const entryPoints = findEntryPoints(graph.nodes, edges);                       // 4. find services that nobody calls
        this.allRoutes = findAllRoutes(entryPoints, adjacency);                        // 5. find every full route from every entry point
        this.nodesByName = buildNodeIndex(graph.nodes);                                // 6. build the Map: name → full node
    }

    getGraph(filterNames: string[]): GraphResponse {                                   // runs on EVERY request
        const filtered = applyFilters(this.allRoutes, filterNames, this.nodesByName);  // keep only the routes that pass the filters
        return routesToGraph(filtered, this.nodesByName);                              // build the drawable answer from them
    }

    getAvailableFilters(): string[] {                                                  // the names a user may ask for
        return [...FILTERS.keys()];                                                    // e.g. ["sink", "public", "vulnerable"]
    }
}
