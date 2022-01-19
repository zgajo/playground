import { Graph } from "./graph";
import { Element, OverpassData, Type } from "../osmnx/interface/graph";
import {
  TGraphNode,
  TGraphWay,
  TPreparedGraphNode,
  TPreparedGraphWay,
} from "./interface/graph";
import {
  usefulTagsNode,
  usefulTagsWay,
  onewayValues,
  reversedValues,
} from "./settings";

export function parseNodesPaths(responseJson: OverpassData) {
  const nodes: TGraphNode = {};

  const paths: TGraphWay = {};

  for (const element of responseJson["elements"]) {
    if (element["type"] === Type.Node) {
      nodes[element.id] = convertNode(element);
    } else if (element["type"] === Type.Way) {
      paths[element.id] = convertPath(element);
    }
  }

  return { nodes, paths };
}

function convertNode(element: Element) {
  if (element.lat === undefined || element.lon === undefined) {
    throw new Error("lat or lon not set");
  }

  const node: TPreparedGraphNode = {
    x: element["lon"],
    y: element["lat"],
  };

  if (element.tags) {
    for (let usefulTag of usefulTagsNode) {
      if (element["tags"][usefulTag]) {
        node[usefulTag] = element["tags"][usefulTag];
      }
    }
  }
  return node;
}

function convertPath(element: Element) {
  const path: TPreparedGraphWay = {
    osmid: element.id,
    nodes: element["nodes"] as number[],
  };

  if (element.tags) {
    for (let usefulTag of usefulTagsWay) {
      if (element["tags"][usefulTag]) {
        path[usefulTag] = element["tags"][usefulTag];
      }
    }
  }
  return path;
}

export const _isPathOneWay = (
  path: TPreparedGraphWay,
  bidirectional?: boolean
) => {
  if (bidirectional) {
    // # if this is a bi-directional network type, then nothing in it is
    // # considered one-way. eg, if this is a walking network, this may very
    // # well be a one-way street (as cars/bikes go), but in a walking-only
    // # network it is a bi-directional edge (you can walk both directions on
    // # a one-way street). so we will add this path (in both directions) to
    // # the graph and set its oneway attribute to False.
    return false;
  } else if (
    "oneway" in path &&
    path["oneway"] &&
    String(path["oneway"]) in onewayValues
  ) {
    // # if this path is tagged as one-way and if it is not a bi-directional
    // # network type then we'll add the path in one direction only
    return true;
  } else if ("junction" in path && path["junction"] == "roundabout") {
    // # roundabouts are also one-way but are not explicitly tagged as such
    return true;
  } else {
    // # otherwise this path is not tagged as a one-way
    return false;
  }
};

export const _isPathReversed = (path: TPreparedGraphWay) => {
  if (
    "oneway" in path &&
    path["oneway"] &&
    String(path["oneway"]) in reversedValues
  ) {
    return true;
  } else {
    return false;
  }
};
