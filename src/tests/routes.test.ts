import { test } from "node:test";                                         // the test runner
import assert from "node:assert/strict";                                  // the checks
import { findRoutesFrom } from "../graph/routes.js";                      // the DFS we're testing

test("a simple chain gives one full route", () => {                       // A → B → C
    const adjacency = new Map<string, string[]>([                         // the tiny graph
        ["A", ["B"]],                                                     // A calls B
        ["B", ["C"]],                                                     // B calls C, C is a leaf
    ]);
    assert.deepEqual(findRoutesFrom("A", adjacency), [["A", "B", "C"]]);  // one route, from A to the leaf
});

test("a branch gives one route per target", () => {                       // A → B and A → C
    const adjacency = new Map<string, string[]>([
        ["A", ["B", "C"]],                                                // A calls two services
    ]);
    assert.deepEqual(findRoutesFrom("A", adjacency), [["A", "B"], ["A", "C"]]);   // two routes
});

test("a service that calls nobody is a route of one node", () => {       // like gateway-service
    const adjacency = new Map<string, string[]>();                        // an empty graph
    assert.deepEqual(findRoutesFrom("X", adjacency), [["X"]]);            // just X itself
});

test("a cycle does not loop forever", () => {                             // A → B → A
    const adjacency = new Map<string, string[]>([
        ["A", ["B"]],                                                     // A calls B
        ["B", ["A"]],                                                     // B calls A back → a cycle
    ]);
    assert.deepEqual(findRoutesFrom("A", adjacency), [["A", "B"]]);       // stops before going back to A
});