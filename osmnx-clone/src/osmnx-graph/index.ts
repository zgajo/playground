import * as fs from "fs";
import * as path from "path";
import { parseNodesPaths } from "./graphHelper";
import { Graph } from "./graph";
import { Distance } from "./distance";

var rseloJson = JSON.parse(
  fs.readFileSync(path.join(__dirname + "/rselo.json"), "utf8")
);

const { nodes, paths } = parseNodesPaths(rseloJson);

const G = new Graph();

for (let nodeKey in nodes) {
  G.addNode(nodeKey, nodes[nodeKey]);
}

Graph._addPaths(G, paths);

console.log(
  `Created graph with ${G.edges.length} edges and ${G.nodes.length} nodes`
);

Distance.addEdgeLength(G);

console.log("first");
