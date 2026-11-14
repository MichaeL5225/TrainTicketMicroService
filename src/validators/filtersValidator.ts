import { UnknownFilterError } from "../errors/UnknownFilterError.js";     // the error we throw for a wrong name


export function parseFilterNames(rawFilters: unknown, availableFilters: string[]): string[] {   // raw value from the URL → clean, checked list of names
    if (typeof rawFilters !== "string") {                                                       // missing (or not a single text value)
        return [];                                                                              // → no filters
    }

    const names = rawFilters                                                                    // e.g. "sink, vulnerable,"
    .split(",")                                                                                 // → ["sink", " vulnerable", ""]
    .map(name => name.trim())                                                                   // → ["sink", "vulnerable", ""]
    .filter(name => name !== "");                                                               // → ["sink", "vulnerable"]

    for (const name of names) {                                                                 // check every name the user sent
        if (!availableFilters.includes(name)) {                                                 // not one of the filters we have?
            throw new UnknownFilterError(`Unknown filter: ${name}`);                            // stop here - the request is invalid
        }
    }

    return names;
}       