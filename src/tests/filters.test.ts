import { test } from "node:test";                                         // the test runner
import assert from "node:assert/strict";                                  // the checks
import { endsInSink } from "../filters/endsInSink.js";                    // filter 1
import { startsInPublic } from "../filters/startsInPublic.js";            // filter 2
import { hasVulnerability } from "../filters/hasVulnerability.js";        // filter 3
import { buildNodeIndex } from "../graph/build.js";                       // turns a list of nodes into name → node
import type { GraphNode } from "../types/graph.js";                       // the node type

const NODES: GraphNode[] = [                                              // a few tiny nodes, each with ONE thing to test
    { name: "web", kind: "service", publicExposed: true },                // public
    { name: "api", kind: "service", publicExposed: false,                 // has a vulnerability
      vulnerabilities: [{ file: "a.java", severity: "high", message: "SQL injection", metadata: { cwe: "CWE-89" } }] },
    { name: "db", kind: "rds" },                                          // a database = a sink
    { name: "queue", kind: "sqs" },                                       // a message queue = NOT a sink (our decision)
];                                                                        // "ghost" is used in routes but is NOT here - like assurance-service
const nodesByName = buildNodeIndex(NODES);                                // name → full node

// ---- endsInSink ----
test("endsInSink: true when the last service is a database", () => {
    assert.equal(endsInSink(["web", "api", "db"], nodesByName), true);    // ends at db (rds)
});

test("endsInSink: false when the last service is a queue (sqs)", () => {
    assert.equal(endsInSink(["web", "queue"], nodesByName), false);       // sqs is not in SINK_KINDS
});

test("endsInSink: false when the last service has no info", () => {
    assert.equal(endsInSink(["web", "ghost"], nodesByName), false);       // ghost is not in the map
});

// ---- startsInPublic ----
test("startsInPublic: true when the first service is public", () => {
    assert.equal(startsInPublic(["web", "db"], nodesByName), true);       // web is public
});

test("startsInPublic: false when the first service is not public", () => {
    assert.equal(startsInPublic(["api", "db"], nodesByName), false);      // api is not public
});

// ---- hasVulnerability ----
test("hasVulnerability: true when any service in the route has one", () => {
    assert.equal(hasVulnerability(["web", "api", "db"], nodesByName), true);   // api has a vulnerability
});

test("hasVulnerability: skips unknown services and keeps checking", () => {
    assert.equal(hasVulnerability(["ghost", "api"], nodesByName), true);  // ghost is skipped, api is still found
});

test("hasVulnerability: false when no service has one", () => {
    assert.equal(hasVulnerability(["web", "db"], nodesByName), false);    // nothing vulnerable here
});