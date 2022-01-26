import { Distance } from "./distance";
import { Graph } from "./graph";
import { calcCrow } from "./graphHelper";

interface IGraphToGdfs {
  G: Graph;
  nodes?: boolean;
  edges?: boolean;
  nodeGeometry?: boolean;
  fillEdgeGeometry?: boolean;
}

const defaultParams = {
  nodes: true,
  edges: true,
  nodeGeometry: true,
  fillEdgeGeometry: true,
};

export const graphToGdfs = (props: IGraphToGdfs) => {
  props = { ...defaultParams, ...props };
  const G = props.G;

  if (props.nodes) {
  }

  const u: number[] = [],
    columns: never[] = [],
    v: number[] = [],
    k: number[] = [],
    data: any[] = [],
    highway: any[][] = [],
    maxspeed: any[][] = [],
    name: any[][] = [],
    length: any[][] = [];

  let gdfEdges = {};

  if (props.edges) {
    if (!G.edges.length) {
      throw new Error("graph contains no edges");
    }

    G.edges.forEach((edge) => {
      u.push(edge[0]);
      v.push(edge[1]);
      k.push(edge[2]);

      const way = G._succ[edge[0]][edge[1]][edge[2]];

      data.push(way);
      highway.push([edge, way.highway]);
      name.push([edge, way.name]);
      length.push([edge, way.length]);
      maxspeed.push([edge, way.maxspeed]);
    });

    if (props.fillEdgeGeometry) {
    } else {
      gdfEdges = {
        u,
        v,
        data,
        k,
        highway,
        ...(maxspeed.length ? { maxspeed } : null),
        name,
        length,
      };
    }
  }

  if (props.nodes && props.edges) {
    return;
  } else if (props.nodes) {
    return;
  } else if (props.edges) {
    return gdfEdges;
  } else {
    throw new Error("you must request nodes or edges or both");
  }
};
