import { Element, OverpassData, Type } from "../osmnx/interface/graph";
import { _isPathOneWay, _isPathReversed } from "./graphHelper";
import {
  TGraphEdges,
  TGraphNode,
  TGraphWay,
  TPreparedGraphNode,
  TPreparedGraphWay,
} from "./interface/graph";
import { onewayValues, usefulTagsNode, usefulTagsWay } from "./settings";

export class Graph {
  _succ: {};
  _pred: {};
  _node: TGraphNode | {};
  _adj: {};
  nodes: string[];
  edges: number[][];

  constructor() {
    this._succ = {};
    this._pred = {};
    this._node = {};
    this._adj = this._succ;
    this.nodes = [];
    this.edges = [];
  }

  addNode(node: string, data: TGraphNode) {
    if (!this._succ[node]) {
      this._succ[node] = {};
      this._pred[node] = {};
      this._node[node] = { ...data };
      this.nodes.push(node);
    }
  }

  addEdgesFrom(ebunchToAdd: TGraphEdges, ...rest: TPreparedGraphWay[]) {
    const keyList = [];

    for (const e of ebunchToAdd) {
      let u, v, key, dd;

      if (e.length === 4) {
        [u, v, key, dd] = e;
      } else if (e.length === 3) {
        [u, v, dd] = e;
        key = null;
      } else if (e.length === 2) {
        [u, v] = e;
        dd = {};
        key = null;
      } else {
        throw new Error(`Edge tuple ${e} musti be a 2, 3 or 4 tuple`);
      }

      let ddd = { ...rest[0] };

      if (typeof dd === "object" && dd !== null) {
        ddd = { ...ddd, ...dd };
      }

      key = this.addEdge(u, v, key);
      this._succ[u][v][key] = ddd;
      this._pred[v][u][key] = ddd;
      keyList.push(key);
    }

    return keyList;
  }
  addEdge(u: number, v: number, key: number | null = null, ...rest: {}[]) {
    if (!(u in this._succ)) {
      this._succ[u] = {};
      this._pred[u] = {};
      this._node[u] = {};
    }
    if (!(v in this._succ)) {
      this._succ[v] = {};
      this._pred[v] = {};
      this._node[v] = {};
    }

    if (key === null) {
      key = this.newEdgeKey(u, v);
    }

    if (v in this._succ[u]) {
      const keyDict = this._adj[u][v];

      let dataDict = keyDict[key];
      dataDict = { ...dataDict, ...rest[0] };
      keyDict[key] = dataDict;
    } else {
      let dataDict = { ...rest[0] };
      const keyDict = {};
      keyDict[key] = dataDict;
      this._succ[u][v] = keyDict;
      this._pred[v][u] = keyDict;
      this.edges.push([u, v, key]);
    }

    return key;
  }

  newEdgeKey(u: number, v: number): number {
    try {
      const keyDict = this._adj[u][v];
      if (!keyDict) {
        throw new Error("keyDict not found");
      }

      let key: number = keyDict.length;
      while (key in keyDict) {
        key += 1;
      }

      return key;
    } catch (error) {
      return 0;
    }
  }

  setEdgeAttributes(values: [number[], number][], name = "") {
    if (name) {
      try {
        for (const [[u, v, key], distValue] of values) {
          console.log("first");
          this._adj[u][v][key][name] = distValue;
        }
      } catch (error) {}
    } else {
    }
  }

  static _addPaths(G: Graph, paths: TGraphWay, bidirectional?: false) {
    for (let pathKey in paths) {
      const path = paths[pathKey];
      let nodes = [...path.nodes];

      const isOneWay = _isPathOneWay(path, bidirectional);
      if (isOneWay && _isPathReversed(path)) {
        nodes = nodes.reverse();
      }

      path.oneway = isOneWay;

      let edges: TGraphEdges = [];

      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push([nodes[i], nodes[i + 1]]);
      }

      if (!isOneWay) {
        edges = edges.concat(edges.map((arr) => arr.slice(0).reverse()));
      }

      G.addEdgesFrom(edges, path);
    }
  }
}
