import { KM_TO_METERS } from "../utils/helper";
import { Graph } from "./graph";

const EARTH_RADIUS_M = 6371009;

export class Distance {
  static addEdgeLength(G: Graph, precision = 3) {
    const uvk = G.edges;

    const c = [];

    try {
      for (let [u, v] of uvk) {
        c.push([G._node[u].y, G._node[u].x, G._node[v].y, G._node[v].x]);
      }
    } catch (error) {
      console.log("error", error);
      process.exit(1);
    }

    const { lat1, lat2, lng1, lng2 } = c.reduce(
      (prevValue, current) => {
        prevValue.lat1.push(current[0]);
        prevValue.lng1.push(current[1]);
        prevValue.lat2.push(current[2]);
        prevValue.lng2.push(current[3]);
        return prevValue;
      },
      {
        lat1: [] as number[],
        lng1: [] as number[],
        lat2: [] as number[],
        lng2: [] as number[],
      }
    );

    const dists = Distance.greatCircleVec(lat1, lng1, lat2, lng2).map((value) =>
      Number(value.toFixed(precision))
    );

    const values = uvk.map((value, index) => [value, dists[index]]) as [
      number[],
      number
    ][];

    G.setEdgeAttributes(values, "length");
  }

  static greatCircleVec(
    lat1: number[],
    lng1: number[],
    lat2: number[],
    lng2: number[],
    earthRadius = EARTH_RADIUS_M
  ) {
    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
      var EARTH_RADIUS_KM = 6371; // km
      var dLat = toRad(lat2 - lat1);
      var dLon = toRad(lon2 - lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = EARTH_RADIUS_KM * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value: number) {
      return (Value * Math.PI) / 180;
    }

    const dist = [];
    for (let i = 0; i < lat1.length; i++) {
      dist.push(calcCrow(lat1[i], lng1[i], lat2[i], lng2[i]) * KM_TO_METERS);
    }
    return dist;
  }
}
