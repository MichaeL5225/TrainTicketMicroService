import { readFileSync } from "node:fs";          // brings Node's function for reading files from disk
import type { RawGraphFile } from "./types.js";  // imports ONLY a type (not code) from your types.ts file


export function loadRawGraph(filePath: string) : RawGraphFile {
    const text = readFileSync(filePath, "utf8")    // reads the file from the disk as one long text
    const data = JSON.parse(text) as RawGraphFile; // JSON.parse returns "any"; "as" tells TS to treat the result as RawGraphFile
    return data;
}


