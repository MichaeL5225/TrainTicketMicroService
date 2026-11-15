import type { Request, Response } from "express";                          // Express's types for req and res
import type { GraphService } from "../services/graphService.js";           // the service type (we only need its type here)
import { parseFilterNames } from "../validators/filtersValidator.js";      // reads and checks the filters from the URL
import { UnknownFilterError } from "../errors/UnknownFilterError.js";      // to recognize a wrong filter name


export function createGraphController(graphService: GraphService) {        // gets the service once, returns the request handlers
    function getGraph(req: Request, res: Response): void {                 // handles GET /graph
        try {                                                              // anything thrown inside jumps to the catch below
            const filterNames = parseFilterNames(req.query.filters, graphService.getAvailableFilters());  // clean + check the names
            res.json(graphService.getGraph(filterNames));                  // ask the service, send the answer (200)
        } catch (error) {                                                  // something was thrown - the validator, or a real bug
            if (error instanceof UnknownFilterError) {                     // a wrong filter name?
                res.status(400).json({                                     // 400 = "your request is wrong"
                    error: error.message,                                  // e.g. "Unknown filter: xyz"
                    availableFilters: graphService.getAvailableFilters(),  // the names that do exist
                });
                return;                                                    // done - the answer was sent
            }
            throw error;                                                   // any other error = a real bug → Express answers 500
        }
    }

    function getFilters(req: Request, res: Response): void {               // handles GET /filters
        res.json({ filters: graphService.getAvailableFilters() });         // e.g. { "filters": ["sink", "public", "vulnerable"] }
    }

    return { getGraph, getFilters };                                       // gives back both handlers as one object
}
