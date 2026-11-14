import { loadRawGraph } from "../data/loader.js";
import { normalizeEdges } from "../graph/normalize.js";
import { buildAdjacency, findEntryPoints, buildNodeIndex } from "../graph/build.js";
import { findAllRoutes } from "../graph/routes.js";                      
import { routesToGraph } from "../graph/response.js";                     
import { applyFilters } from "../filters/applyFilters.js";                
import { FILTERS } from "../filters/registry.js";                         
import type { GraphNode } from "../types/graph.js";                      
import type { GraphResponse } from "../types/api.js";


export class GraphService {
    private readonly allRoutes: string[][];
    private readonly nodesByName: Map<string, GraphNode>;

    constructor(dataFilePath: string) {                                                           // runs ONCE when we do "new GraphService(...)"
        const graph = loadRawGraph(dataFilePath);                                                 // 1. read the file
        const edges = normalizeEdges(graph.edges);                                                // 2. split edges into one-target pairs
        const adjacency = buildAdjacency(edges);                                                  // 3. build the Map: service → its targets
        const entryPoints = findEntryPoints(graph.nodes, edges);                                  // 4. find services that nobody calls
        this.allRoutes = findAllRoutes(entryPoints, adjacency);                                   // 5. find every full route from every entry point
        this.nodesByName = buildNodeIndex(graph.nodes);                                           // 6. build the Map: name → full node
    }

    getGraph(filterNames: string[]): GraphResponse {                                              // runs on EVERY request           
        const filtered = applyFilters(this.allRoutes, filterNames, this.nodesByName);             // the filters from the URL
        return routesToGraph(filtered, this.nodesByName);
    }

    getAvailableFilters(): string[] {                                                             // the names a user may ask for
        return[...FILTERS.keys()];
    }
}