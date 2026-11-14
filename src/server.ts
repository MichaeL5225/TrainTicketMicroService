import express from "express";                                                                                  // the server library
import { UnknownFilterError } from "./errors/UnknownFilterError.js";
import { GraphService } from "./services/graphService.js";                                                      // the graph logic


// ---- runs ONCE, when the server starts (steps 1-6) ----
const graphService = new GraphService("data/graph.json");                 // the constructor runs steps 1-6 right here

const app = express();                                                                    // creates the server application
const PORT = 3000;                                                                        // the "door number" the server listens on

// ---- runs on EVERY request to /graph (steps 7-8) ----
app.get("/graph", (req, res) => {                                                         // "when someone opens /graph, run this function"
    const rawFilters = req.query.filters;                                                 // the text after "?filters=" in the URL (or undefined if it's not there)
    const filterNames = typeof rawFilters === "string"                                    // did we get one plain text value?
    ? rawFilters.split(",")                                                               // yes → split it by commas: "sink,vulnerable" → ["sink", "vulnerable"]
    .map(name => name.trim())                                                             // remove spaces around each name → ["sink", "vulnerable", ""]
    .filter(name => name !== "")                                                          // drop empty names → ["sink", "vulnerable"]
    : [];                                                                                 // no → no filters
    try {
        res.json(graphService.getGraph(filterNames));                                         // the service filters and builds the answer
    } catch (error) {                                                                         // "...and if something was thrown, come here"
        if (error instanceof UnknownFilterError) {                                            // is it OUR error - a wrong filter name?
            res.status(400).json({                                                            // reply with 400 = "your request is wrong"
                error: error.message,                                                         // e.g. "Unknown filter: xyz"
                availableFilters: graphService.getAvailableFilters(),                         // the service knows the filter names
            });
            return;
        }
        throw error;                                                                          // any other error is a real bug - let Express handle it as 500
    }
    
});


app.listen(PORT, () => {                                                                  // starts the server and waits for requests
    console.log(`Server running at http://localhost:${PORT}/graph`);                      // prints once it's ready
});