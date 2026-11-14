import express from "express";                                                                                  // the server library
import { UnknownFilterError } from "./errors/UnknownFilterError.js";
import { GraphService } from "./services/graphService.js";                                                      // the graph logic
import { parseFilterNames } from "./validators/filtersValidator.js";                                            // reads and checks the filters from the URL
import { createGraphController } from "./controllers/graphController.js"; // builds the request handlers


// ---- runs ONCE, when the server starts (steps 1-6) ----
const graphService = new GraphService("data/graph.json");                 // the constructor runs steps 1-6 right here

const app = express();                                                                    // creates the server application
const PORT = 3000;                                                                        // the "door number" the server listens on

// ---- runs on EVERY request to /graph (steps 7-8) ----
const graphController = createGraphController(graphService);              // the controller gets the service it should use

app.get("/graph", graphController.getGraph);                              // GET /graph → the controller's getGraph
app.get("/filters", graphController.getFilters);                          // GET /filters → the controller's getFilters


app.listen(PORT, () => {                                                                  // starts the server and waits for requests
    console.log(`Server running at http://localhost:${PORT}/graph`);                      // prints once it's ready
});