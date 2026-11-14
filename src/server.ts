import express from "express";                                                                                  // the server library
import { loadRawGraph, normalizeEdges } from "./loader.js";                                                     // reading and cleaning the data
import { buildAdjacency, findEntryPoints, findAllRoutes, buildNodeIndex, routesToGraph } from "./graph.js";     // graph logic
import { applyFilters } from "./filters.js";                                                                    // the generic filtering

// ---- runs ONCE, when the server starts (steps 1-6) ----
const graph = loadRawGraph("data/graph.json");                                            // 1. read the file
const edges = normalizeEdges(graph.edges);                                                // 2. split edges into one-target pairs
const adjacency = buildAdjacency(edges);                                                  // 3. build the Map: service → its targets
const entryPoints = findEntryPoints(graph.nodes, edges);                                  // 4. find services that nobody calls
const allRoutes = findAllRoutes(entryPoints, adjacency);                                  // 5. find every full route from every entry point
const nodesByName = buildNodeIndex(graph.nodes);                                          // 6. build the Map: name → full node

const app = express();                                                                    // creates the server application
const PORT = 3000;                                                                        // the "door number" the server listens on

// ---- runs on EVERY request to /graph (steps 7-8) ----
app.get("/graph", (req, res) => {                                                         // "when someone opens /graph, run this function"
    const rawFilters = req.query.filters;                                                 // the text after "?filters=" in the URL (or undefined if it's not there)
    const filterNames = typeof rawFilters === "string"                                    // did we get one plain text value?
    ? rawFilters.split(",")                                                               // yes → split it by commas: "sink,vulnerable" → ["sink", "vulnerable"]
    : [];                                                                                 // no → no filters
    const filtered = applyFilters(allRoutes, filterNames, nodesByName);                   // the filters from the URL
    const response = routesToGraph(filtered, nodesByName);                                // turns the routes into { nodes, edges }
    res.json(response);                                                                   // sends it back to the caller as JSON
});


app.listen(PORT, () => {                                                                  // starts the server and waits for requests
    console.log(`Server running at http://localhost:${PORT}/graph`);                      // prints once it's ready
});