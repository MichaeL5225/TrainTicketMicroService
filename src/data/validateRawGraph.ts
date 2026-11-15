import type { RawGraphFile } from "../types/raw.js";                                          // the shape we promise to return
import { InvalidDataFileError } from "../errors/InvalidDataFileError.js";                     // the error we throw for a broken file


function isObject(value: unknown): value is Record<string, unknown> {                         // type guard: "is this a plain object { ... }?"
    return typeof value === "object" && value !== null && !Array.isArray(value);              // not null, not an array
}

export function validateRawGraph(data: unknown): RawGraphFile {                               // checks the shape; returns the data or throws
    if (!isObject(data)) {                                                                    // the whole file must be { ... }
        throw new InvalidDataFileError("The data file must contain a JSON object");           // e.g. the file holds [1, 2] or "hello"
    }
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {                           // both lists must exist
        throw new InvalidDataFileError('The data file must have "nodes" and "edges" lists');  // one of them is missing or not a list
    }

    for (let i = 0; i < data.nodes.length; i++) {                                             // check every node
        const node = data.nodes[i];                                                           // one node
        if (!isObject(node) || typeof node.name !== "string" || typeof node.kind !== "string") {  // isObject FIRST - otherwise null.name would crash
            throw new InvalidDataFileError(`nodes[${i}] must have a string "name" and "kind"`);  // says exactly which one
        }
    }

    for (let i = 0; i < data.edges.length; i++) {                                             // check every edge
        const edge = data.edges[i];                                                           // one edge
        const to = isObject(edge) ? edge.to : undefined;                                      // its "to", if it's an object at all
        const toIsValid = typeof to === "string"                                              // "to" is one name (like consign-service)...
            || (Array.isArray(to) && to.every(target => typeof target === "string"));         // ...or a list of names
        if (!isObject(edge) || typeof edge.from !== "string" || !toIsValid) {                 // any part missing or of the wrong type
            throw new InvalidDataFileError(`edges[${i}] must have a string "from" and a "to" that is a string or a list of strings`);  // says exactly which one
        }
    }

    return data as unknown as RawGraphFile;                                                   // now the promise is TRUE - we checked it
}
