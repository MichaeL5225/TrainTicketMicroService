import { test } from "node:test";                                         // the test runner
import assert from "node:assert/strict";                                  // the checks
import { GraphService } from "../services/graphService.js";              // the class under test
import { UnknownFilterError } from "../errors/UnknownFilterError.js";     // the error for a wrong name
import { config } from "../config.js";                                    // the path to the real data file

const graphService = new GraphService(config.dataFilePath);               // built ONCE for all tests - the constructor runs the whole chain here

test("no filters: the whole graph", () => {
    const result = graphService.getGraph([]);                             // no filters at all
    assert.equal(result.routes.length, 222);                              // every full route
    assert.equal(result.nodes.length, 47);                                // 46 from the file + assurance-service as "unknown"
    assert.equal(result.edges.length, 98);                                // every arrow after normalization
});

test("sink: only routes that end in a database", () => {
    const result = graphService.getGraph(["sink"]);
    assert.equal(result.routes.length, 30);                               // routes that end in prod-postgresdb
    assert.equal(result.nodes.length, 21);                                // only the services on those routes
    assert.equal(result.edges.length, 40);                                // only the arrows on those routes
});

test("public: only routes that start at a public service", () => {
    assert.equal(graphService.getGraph(["public"]).routes.length, 6);     // 5 from frontend + gateway-service alone
});

test("public + sink together: no route matches both", () => {
    assert.equal(graphService.getGraph(["public", "sink"]).routes.length, 0);   // the finding we documented
});

test("lists the available filter names", () => {
    assert.deepEqual(graphService.getAvailableFilters(), ["sink", "public", "vulnerable"]);   // in registry order
});

test("throws for an unknown filter even without the validator", () => {   // the "safety net" in applyFilters
    assert.throws(() => graphService.getGraph(["xyz"]), UnknownFilterError);
});