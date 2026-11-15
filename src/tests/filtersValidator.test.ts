import { test } from "node:test";                                          // Node's built-in test runner
import assert from "node:assert/strict";                                   // Node's built-in checks
import { parseFilterNames } from "../validators/filtersValidator.js";      // the function under test
import { UnknownFilterError } from "../errors/UnknownFilterError.js";      // the error we expect for wrong names

const AVAILABLE = ["sink", "public", "vulnerable"];                       // the allowed names - same as the real registry

test("returns clean names: splits, trims and drops empty ones", () => {   // the normal case, with messy input
    assert.deepEqual(parseFilterNames("sink, vulnerable,", AVAILABLE), ["sink", "vulnerable"]);   // spaces + trailing comma
});

test("returns [] when there is no filters parameter", () => {             // /graph with nothing after it
    assert.deepEqual(parseFilterNames(undefined, AVAILABLE), []);         // req.query.filters is undefined
});

test("returns [] for an empty value", () => {                             // /graph?filters=
    assert.deepEqual(parseFilterNames("", AVAILABLE), []);                // "" → split gives [""] → dropped
});

test("throws UnknownFilterError for a name that does not exist", () => {  // the user made a typo
    assert.throws(() => parseFilterNames("sink,xyz", AVAILABLE), UnknownFilterError);   // must throw OUR error type
});

test("throws for inherited object names like 'constructor'", () => {     // regression test for the bug we fixed
    assert.throws(() => parseFilterNames("constructor", AVAILABLE), UnknownFilterError);
});