import { loadRawGraph } from "./loader.js";

const graph = loadRawGraph("data/graph.json"); // calls it with the path to thje data file
console.log("nodes:", graph.nodes.length);     // prints how many nodes were loaded
console.log("edges:", graph.edges.length);     // prints how many edges were loaded