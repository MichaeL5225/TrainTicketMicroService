import { endsInSink } from "./endsInSink.js";
import { hasVulnerability } from "./hasVulnerability.js";
import { startsInPublic } from "./startsInPublic.js";
import type { RouteFilter } from "../types/filters.js";



export const FILTERS = new Map<string, RouteFilter>([
    ["sink", endsInSink], // ?filters=sink        → routes that end in a database
    ["public", startsInPublic], // ?filters=public      → routes that start at a public service
    ["vulnerable", hasVulnerability], // ?filters=vulnerable  → routes that pass through a vulnerable service
]);
