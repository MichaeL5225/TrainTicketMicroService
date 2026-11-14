import express from "express";                                                                                  // the server library
import { UnknownFilterError } from "./errors/UnknownFilterError.js";
import { GraphService } from "./services/graphService.js";                                                      // the graph logic
import { parseFilterNames } from "./validators/filtersValidator.js";                                            // reads and checks the filters from the URL
import { createGraphController } from "./controllers/graphController.js"; // builds the request handlers
import { createGraphRouter } from "./routes/graphRoutes.js";              // all the graph routes


// ---- runs ONCE, when the server starts (steps 1-6) ----
const graphService = new GraphService("data/graph.json");                 // the constructor runs steps 1-6 right here

const app = express();                                                                    // creates the server application
const PORT = 3000;                                                                        // the "door number" the server listens on

// ---- runs on EVERY request to /graph (steps 7-8) ----
app.use(createGraphRouter(graphService));                                 // plugs all the graph routes into the app

app.listen(PORT, () => {                                                                  // starts the server and waits for requests
    console.log(`Server running at http://localhost:${PORT}/graph`);                      // prints once it's ready
});