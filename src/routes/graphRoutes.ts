import { Router } from "express";                                          // Express's tool for grouping routes
import type { GraphService } from "../services/graphService.js";           // the service type
import { createGraphController } from "../controllers/graphController.js"; // builds the request handlers


export function createGraphRouter(graphService: GraphService): Router {    // gets the service, returns a ready Router
   const router = Router();                                                // an empty "mini-app" that only holds routes
   const graphController = createGraphController(graphService);            // the handlers, connected to this service

   router.get("/graph", graphController.getGraph);                         // GET /graph   → getGraph
   router.get("/filters", graphController.getFilters);                     // GET /filters → getFilters

   return router;                                                          // gives the Router back, to be plugged into the app
}