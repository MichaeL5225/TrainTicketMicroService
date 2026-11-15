import type { RawGraphEdge } from "../types/raw.js";                            // an edge as it is in the file ("to" = string or string[])
import type { GraphEdge } from "../types/graph.js";                             // an edge as the program uses it ("to" = one string)



export function normalizeEdges(rawEdges: RawGraphEdge[]): GraphEdge[] {         // turns every file edge into one edge per target
    const result: GraphEdge[] = [];                                             // an empty array that will hold GraphEdge objects

    for (const rawEdge of rawEdges) {                                           // loops over every edge from the file
        const targets = Array.isArray(rawEdge.to) ? rawEdge.to : [rawEdge.to];  // if array - use it; if string - wrap it in a new array
        for (const target of targets) {                                         // loops over every target of THIS edge
            result.push({ from: rawEdge.from, to: target });                    // adds ONE edge: the same "from", a single "to"
        }
    }

    return result;                                                              // 27 file edges → 98 one-target edges

}
