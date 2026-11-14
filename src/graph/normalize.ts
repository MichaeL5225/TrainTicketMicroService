import type { RawGraphEdge } from "../types/raw.js";
import type { GraphEdge } from "../types/graph.js";



export function normalizeEdges(rawEdges: RawGraphEdge[]): GraphEdge[] {
    const result: GraphEdge[] = []; // an empty array that will hold GraphEdge objects

    for (const rawEdge of rawEdges) { // loops over every edge from the file
        const targets = Array.isArray(rawEdge.to) ? rawEdge.to : [rawEdge.to]; // if array - use it; if string - wrap it in a new array
        for (const target of targets) {
            result.push({ from: rawEdge.from, to: target });
        }
    }

    return result;

}
