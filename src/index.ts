import { loadRawGraph, normalizeEdges } from "./loader.js";

const graph = loadRawGraph("data/graph.json"); // calls it with the path to thje data file
const edges = normalizeEdges(graph.edges);     //splits the file edges into one target edges
console.log("nodes:", graph.nodes.length);     // prints how many nodes were loaded
console.log("edges:", graph.edges.length);     // prints how many edges were loaded
console.log("normalized edges:", edges.length);//prints how many normlized edges were loaded