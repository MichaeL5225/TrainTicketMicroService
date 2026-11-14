import { config } from "./config.js";                                     // port + data file path
import { GraphService } from "./services/graphService.js";                // the graph logic
import { createApp } from "./app.js";                                     // builds the Express app


const graphService = new GraphService(config.dataFilePath);               // computes everything ONCE
const app = createApp(graphService);                                      // builds the app around the service

app.listen(config.port, () => {                                           // starts listening - the ONLY thing this file really does
    console.log(`Server running at http://localhost:${config.port}/graph`); // prints once it's ready
});