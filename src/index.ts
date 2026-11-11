import { loadRawGraph, normalizeEdges } from "./loader.js";
import { buildAdjacency, findRoutesFrom, findEntryPoints } from "./graph.js";

const graph = loadRawGraph("data/graph.json"); // calls it with the path to thje data file
const edges = normalizeEdges(graph.edges);     //splits the file edges into one target edges
const adjacency = buildAdjacency(edges);                             // builds the Map: service → its targets
const routes = findRoutesFrom("frontend", adjacency);              // finds every full route that starts at frontend
const entryPoints = findEntryPoints(graph.nodes, edges);    // finds every service that nobody calls

console.log("nodes:", graph.nodes.length);     // prints how many nodes were loaded
console.log("edges:", graph.edges.length);     // prints how many edges were loaded
console.log("normalized edges:", edges.length);//prints how many normlized edges were loaded
console.log("services with outgoing edges:", adjacency.size);        // how many keys are in the Map
console.log("auth-service →", adjacency.get("auth-service"));       // the list of targets for one service

console.log("routes from frontend:", routes.length);               // how many routes were found
console.log(routes);                                               // prints all of them

console.log("entry points:", entryPoints.length);           // how many were found
console.log(entryPoints);                                   // prints their names