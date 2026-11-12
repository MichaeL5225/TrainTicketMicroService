import { loadRawGraph, normalizeEdges } from "./loader.js";                               // functions that read and clean the data
import { buildAdjacency, findEntryPoints, findAllRoutes, buildNodeIndex } from "./graph.js";   // functions that work on the graph
import { applyFilters } from "./filters.js";                                              // the generic filtering function

const graph = loadRawGraph("data/graph.json");                                            // 1. read the file
const edges = normalizeEdges(graph.edges);                                                // 2. split edges into one-target pairs
const adjacency = buildAdjacency(edges);                                                  // 3. build the Map: service → its targets
const entryPoints = findEntryPoints(graph.nodes, edges);                                  // 4. find services that nobody calls
const allRoutes = findAllRoutes(entryPoints, adjacency);                                  // 5. find every full route from every entry point
const nodesByName = buildNodeIndex(graph.nodes);                                          // 6. build the Map: name → full node


console.log("nodes:", graph.nodes.length, "| edges:", edges.length);                      // quick sanity check: 46 | 98
console.log("entry points:", entryPoints.length, "| routes:", allRoutes.length);          // quick sanity check: 18 | 222

console.log("sink:", applyFilters(allRoutes, ["sink"], nodesByName).length);                             // expected: 30
console.log("public:", applyFilters(allRoutes, ["public"], nodesByName).length);                         // expected: 6
console.log("vulnerable:", applyFilters(allRoutes, ["vulnerable"], nodesByName).length);                 // expected: 60
console.log("sink + vulnerable:", applyFilters(allRoutes, ["sink", "vulnerable"], nodesByName).length);  // expected: 30
console.log("public + sink:", applyFilters(allRoutes, ["public", "sink"], nodesByName).length);          // expected: 0
console.log("no filters:", applyFilters(allRoutes, [], nodesByName).length);                             // expected: 222