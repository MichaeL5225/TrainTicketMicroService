import { test, before, after } from "node:test";                          // test + "run once before all" + "run once after all"
import assert from "node:assert/strict";                                  // the checks
import type { Server } from "node:http";                                  // the type of a running server
import type { AddressInfo } from "node:net";                              // the type that holds the chosen port
import { createApp } from "../app.js";                                    // builds the app WITHOUT listening
import { GraphService } from "../services/graphService.js";              // the real service
import { config } from "../config.js";                                    // the real data file path
import type { GraphResponse } from "../types/api.js";                     // the shape of a 200 answer

let server: Server;                                                       // the running test server (set in before)
let baseUrl: string;                                                      // e.g. "http://localhost:53127" (set in before)

before(async () => {                                                      // runs ONCE, before all tests in this file
    const app = createApp(new GraphService(config.dataFilePath));         // the real app, with the real data
    await new Promise<void>(resolve => {                                  // wait until the server is actually listening
        server = app.listen(0, () => resolve());                          // port 0 = "OS, pick any free port"
    });
    const { port } = server.address() as AddressInfo;                     // which port did the OS pick?
    baseUrl = `http://localhost:${port}`;                                 // the address all tests will call
});

after(() => {                                                             // runs ONCE, after all tests
    server.closeAllConnections();                                         // drop open connections
    server.close();                                                       // turn the server off, so the test run can end
});

test("GET /graph?filters=sink returns 200 and 30 routes", async () => {
    const response = await fetch(`${baseUrl}/graph?filters=sink`);        // a real HTTP request, like the browser
    assert.equal(response.status, 200);                                   // success
    const body = await response.json() as GraphResponse;                  // read the JSON answer
    assert.equal(body.routes.length, 30);                                 // the known number
});

test("GET /graph?filters=xyz returns 400 with the available filters", async () => {
    const response = await fetch(`${baseUrl}/graph?filters=xyz`);
    assert.equal(response.status, 400);                                   // "your request is wrong"
    const body = await response.json() as { error: string; availableFilters: string[] };   // the shape of our error answer
    assert.equal(body.error, "Unknown filter: xyz");
    assert.deepEqual(body.availableFilters, ["sink", "public", "vulnerable"]);
});

test("GET /filters lists the filter names", async () => {
    const response = await fetch(`${baseUrl}/filters`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { filters: ["sink", "public", "vulnerable"] });
});

test("does not reveal that the server is Express", async () => {
    const response = await fetch(`${baseUrl}/filters`);
    assert.equal(response.headers.get("x-powered-by"), null);             // the header must not exist
});

test("an unknown address returns 404", async () => {
    const response = await fetch(`${baseUrl}/hello`);
    assert.equal(response.status, 404);                                   // no route matches
});