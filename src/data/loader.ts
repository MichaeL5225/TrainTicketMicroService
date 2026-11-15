import { readFileSync } from "node:fs";                                   // Node's function for reading files ("node:" = built-in module)
import type { RawGraphFile } from "../types/raw.js";                      // the shape we return
import { validateRawGraph } from "./validateRawGraph.js";                 // the shape check you just wrote
import { InvalidDataFileError } from "../errors/InvalidDataFileError.js";  // the error for a broken file


export function loadRawGraph(filePath: string): RawGraphFile {            // reads the file, checks it, returns it
    const text = readFileSync(filePath, "utf8");                          // the file as one long text
    let data: unknown;                                                    // "we don't know what's inside yet"
    try {
        data = JSON.parse(text);                                          // text → object (throws if the text is not valid JSON)
    } catch {
        throw new InvalidDataFileError(`${filePath} is not valid JSON`);  // a clear message instead of the parser's error
    }
    return validateRawGraph(data);                                        // check the shape before anyone uses it
}