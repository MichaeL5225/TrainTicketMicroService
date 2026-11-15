import { test } from "node:test";                                         // the test runner
import assert from "node:assert/strict";                                  // the checks
import { validateRawGraph } from "../data/validateRawGraph.js";           // the function under test
import { InvalidDataFileError } from "../errors/InvalidDataFileError.js";  // the error we expect for a broken file


test("accepts a valid file, including a 'to' that is a single string", () => {   // the good case - like consign-service
    const data = { nodes: [{ name: "A", kind: "service" }], edges: [{ from: "A", to: "B" }] };   // a tiny valid file
    assert.deepEqual(validateRawGraph(data), data);                       // it must come back exactly as it went in
});

test("rejects a file without edges", () => {                             // "edges" is missing completely
    assert.throws(() => validateRawGraph({ nodes: [] }), InvalidDataFileError);
});

test("rejects a node without a name", () => {                            // a node with only "kind"
    assert.throws(() => validateRawGraph({ nodes: [{ kind: "service" }], edges: [] }), InvalidDataFileError);
});

test("rejects an edge whose 'to' is a number", () => {                   // "to" must be a string or a list of strings
    assert.throws(() => validateRawGraph({ nodes: [], edges: [{ from: "A", to: 5 }] }), InvalidDataFileError);
});