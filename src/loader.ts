import { readFileSync } from "node:fs";          // brings Node's function for reading files from disk
import type { GraphEdge, RawGraphFile, RawGraphEdge } from "./types.js";  // imports ONLY a type (not code) from your types.ts file


export function loadRawGraph(filePath: string) : RawGraphFile {
    const text = readFileSync(filePath, "utf8")    // reads the file from the disk as one long text
    const data = JSON.parse(text) as RawGraphFile; // JSON.parse returns "any"; "as" tells TS to treat the result as RawGraphFile
    return data;
}

export function normalizeEdges(rawEdges: RawGraphEdge[]) : GraphEdge[] {  // gets the edges from the file, returns one edge per pair
    const result: GraphEdge[] = [];                                       // an empty array that will hold GraphEdge objects

    for (const rawEdge of rawEdges) {                                     // loops over every edge from the file
        const targets = Array.isArray(rawEdge.to) ? rawEdge.to : [rawEdge.to];               // if array - use it; if string - wrap it in a new array
        for (const target of targets){
            result.push({ from : rawEdge.from, to : target});
        }
    }

    return result;

}


