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
    highwayTypes: string[];
    maxspeed?: any[][];
    name: any[][];
    length: any[][];
  };

  if (edges) {
    const highways = edges.highway;

    highways.map((el) => {
      if (el[1]?.constructor.name === "Object") {
        const highwayType = [...el[1]][0];

        if (!edges.highwayTypes.includes(highwayType)) {
          edges.highwayTypes.push(highwayType);
        }
        return [el[0], highwayType];
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

      edges["speed_kph"] = edges.maxspeed.filter((el) => el[1] >= 0);
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
