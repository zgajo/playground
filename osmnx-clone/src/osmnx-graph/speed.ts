import { Graph } from "./graph";
import { graphToGdfs } from "./utils";

export const addEdgeSpeeds = (
  G: Graph,
  _hwySpeeds?: undefined,
  fallback?: undefined,
  precision = 1
) => {
  const edges = graphToGdfs({ G, fillEdgeGeometry: false, nodes: false }) as {
    u: number[];
    columns: never[];
    v: number[];
    k: number[];
    data: any[];
    highway: any[][];
    maxspeed?: any[][];
    name: any[][];
    length: any[][];
  };

  if (edges) {
    edges.highway = edges.highway.map((el) => {
      if (el[1]?.constructor.name === "Object") {
        return [el[0], new Set(el[1])[0]];
      }
      return el;
    });

    if (edges.maxspeed) {
      edges.maxspeed = edges.maxspeed.map((el) => {
        if (el[1]?.constructor.name === "Object") {
          const set = new Set(el[1]);
          let sum = 0;
          set.forEach((el: any) => {
            sum += Number(el);
          });
          return [el[0], sum / set.size];
        }

        return el;
      });

      edges["speed_kph"] = edges.maxspeed;
    } else {
      edges["speed_kph"] = null;
    }

    // if (!_hwySpeeds) {
    //   const hwySpeedAvg;
    // } else {
    //   const hwySpeedAvg;
    // }
  }

  console.log("first");
};
