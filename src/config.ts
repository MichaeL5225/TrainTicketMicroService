import { fileURLToPath } from "node:url";                                 // turns a "file:///..." address into a normal path

export const config = {                                                   // all the settings in one place
    port: Number(process.env.PORT ?? 3000),                               // the port: from the environment if set, otherwise 3000
    dataFilePath: process.env.DATA_FILE                                   // the data file: from the environment if set...
        ?? fileURLToPath(new URL("../data/graph.json", import.meta.url)), // ...otherwise data/graph.json, relative to THIS file
};