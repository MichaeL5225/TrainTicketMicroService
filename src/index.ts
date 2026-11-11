import { loadRawGraph, normalizeEdges } from "./loader.js";                               // functions that read and clean the data
import { buildAdjacency, findEntryPoints, findAllRoutes } from "./graph.js";              // functions that work on the graph

const graph = loadRawGraph("data/graph.json");                                            // 1. read the file
const edges = normalizeEdges(graph.edges);                                                // 2. split edges into one-target pairs
const adjacency = buildAdjacency(edges);                                                  // 3. build the Map: service → its targets
const entryPoints = findEntryPoints(graph.nodes, edges);                                  // 4. find services that nobody calls
const allRoutes = findAllRoutes(entryPoints, adjacency);                                  // 5. find every full route from every entry point

console.log("nodes:", graph.nodes.length, "| edges:", edges.length);                      // quick sanity check: 46 | 98
console.log("entry points:", entryPoints.length, "| routes:", allRoutes.length);          // quick sanity check: 18 | 222