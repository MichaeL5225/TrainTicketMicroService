import { endsInSink } from "./endsInSink.js";              // filter: the route ends in a database
import { hasVulnerability } from "./hasVulnerability.js";  // filter: the route passes through a vulnerable service
import { startsInPublic } from "./startsInPublic.js";      // filter: the route starts at a public service
import type { RouteFilter } from "../types/filters.js";    // the type every filter function must match



export const FILTERS = new Map<string, RouteFilter>([      // the list of all filters: name in the URL → filter function (a Map, so "constructor" etc. are not filters)
    ["sink", endsInSink],                                  // ?filters=sink        → routes that end in a database
    ["public", startsInPublic],                            // ?filters=public      → routes that start at a public service
    ["vulnerable", hasVulnerability],                      // ?filters=vulnerable  → routes that pass through a vulnerable service
]);
