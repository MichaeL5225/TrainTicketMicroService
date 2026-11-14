import { readFileSync } from "fs";
import type { RawGraphFile } from "../types/raw.js";



export function loadRawGraph(filePath: string): RawGraphFile {
    const text = readFileSync(filePath, "utf8"); // reads the file from the disk as one long text
    const data = JSON.parse(text) as RawGraphFile; // JSON.parse returns "any"; "as" tells TS to treat the result as RawGraphFile
    return data;
}
