import type { GraphResponse } from "../types/api.js";
import type { GraphNode, GraphEdge } from "../types/graph.js";


export function routesToGraph(routes: string[][], nodesByName: Map<string, GraphNode>): GraphResponse {
    const nodeNames = new Set<string>(); // basket 1: every service name we see in the routes (set = no duplicates)
    const edgeKeys = new Set<string>(); // basket 2: every arrow we see, written as text like "A->B" 
    const edges: GraphEdge[] = []; // basket 3: the real arrow objects {from, to} that we'll return

    for (const route of routes) { // loops over every route (each route is a list of service names)
        for (let i = 0; i < route.length; i++) { // loops over the positions in this route: 0, 1, 2...
            const current = route[i]; // the service name at position i (string or undefined for TS)

            if (current === undefined) { // can't really happen here, but TS doesn't know that
                continue; // skip, to satisfy the compiler
            }
            nodeNames.add(current); // PART 1: put the name in basket 1 (duplicates are ignored)

            const next = route[i + 1]; // the service AFTER current in the route (undefined if current is the last one)

            if (next === undefined) { // current is the last service - there is no arrow after it
                continue;
            }

            const edgeKey = `${current}->${next}`; // the arrow as text, e.g. "user-service->auth-service"

            if (!edgeKeys.has(edgeKey)) { // have we NOT seen this arrow before?
                edgeKeys.add(edgeKey); // remember it in basket 2, so next time we'll know it's a duplicate
                edges.push({ from: current, to: next }); // put the real arrow object in basket 3
            }
        }
    }

    const nodes: GraphNode[] = []; // the full node objects we'll return

    for (const name of nodeNames) { // loops over every unique service name we collected
        const node = nodesByName.get(name); // looks up the full object (or undefined if there's no info)

        if (node === undefined) { // a service that edges point to, but isn't defined in the file
            nodes.push({ name: name, kind: "unknown" }); // add a minimal "placeholder" node so the arrow has something to point to
        }
        else {
            nodes.push(node); // add the full object with all its details
        }
    }

    return { routes: routes, nodes: nodes, edges: edges }; // the routes themselves + the graph built from them
}
