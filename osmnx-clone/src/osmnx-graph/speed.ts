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
    edges.highway = edges.highway.map((el) => {
      if (el[1]?.constructor.name === "Object") {
        const highwayType = [...el[1]][0];

        if (!edges.highwayTypes.includes(highwayType)) {
          edges.highwayTypes.push(highwayType);
        }
        return [el[0], highwayType];
      }

      if (!edges.highwayTypes.includes(el[1])) {
        edges.highwayTypes.push(el[1]);
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

    // let hwySpeedAvg =
    // if (!_hwySpeeds) {
    //   const hwySpeedAvg;
    // } else {
    //   const hwySpeedAvg;
    // }

    const hwySpeedAvg = {};

    const groupByHighway = edges.highway.reduce((entryMap, e, index) => {
      console.log(e[1]);
      if (!(e[1] in hwySpeedAvg)) {
        hwySpeedAvg[e[1]] = null;
      }

      if (edges["speed_kph"][index][1]) {
        hwySpeedAvg[e[1]] = [
          ...(hwySpeedAvg[e[1]] ? hwySpeedAvg[e[1]] : []),
          edges["speed_kph"][index][1],
        ];
      }
      return entryMap.set(e[1], [...(entryMap.get(e[1]) || []), e]);
    }, new Map());

    //* Stavljamo speed za svako road
    const arrAvg = (arr: any[]) =>
      arr.reduce((a, b) => Number(a) + Number(b), 0) / arr.length;

    let avg = 0;

    for (const key in hwySpeedAvg) {
      if (hwySpeedAvg[key]) {
        const speedAvg = arrAvg(hwySpeedAvg[key]);
        hwySpeedAvg[key] = speedAvg;

        if (avg) {
          avg += speedAvg / 2;
        } else {
          avg += speedAvg;
        }
      }
    }

    for (const key in hwySpeedAvg) {
      if (!hwySpeedAvg[key]) {
        hwySpeedAvg[key] = avg;
      }
    }

    const speedKph = edges.highway.map((el, index) => {
      if (edges["speed_kph"][index][1]) {
        return [el[1], Number(edges["speed_kph"][index][1])];
      }
      return [el[1], hwySpeedAvg[el[1]]];
    });

    edges["speed_kph"] = speedKph.map((el, index) => {
      return [edges.highway[index][0], parseFloat(el[1]).toFixed(1)];
    });

    G.setEdgeAttributes(edges["speed_kph"], "speed_kph");

    return G;
  }

  console.log("first");
};
