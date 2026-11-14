import express from "express";                                            // the server library
import type { Express } from "express";                                   // the type of an Express app
import type { GraphService } from "./services/graphService.js";           // the service type
import { createGraphRouter } from "./routes/graphRoutes.js";              // all the graph routes

export function createApp(graphService: GraphService): Express {          // builds a ready app - but does NOT start listening
    const app = express();                                                // creates the server application
    app.disable("x-powered-by");                                          // don't tell every caller "this server is Express" (security)
    app.use(createGraphRouter(graphService));                             // plugs in the graph routes
    return app;                                                           // whoever calls this decides if and where to listen
}