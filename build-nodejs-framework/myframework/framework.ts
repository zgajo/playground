import * as http from "http";
const networkInterfaces = require("os").networkInterfaces();

import { Router } from "./router";
import { RequestParser } from "./router/helper";

export class Framework extends Router {
  server: http.Server;

  constructor() {
    super();
    const requestParser = new RequestParser();
    this.server = http.createServer((req, res) => {
      requestParser.parse(req);
      console.log("Now we have a http message with headers but no data yet.");
      req.on("data", (chunk) => {
        console.log("A chunk of data has arrived: ", chunk);
      });
      req.on("end", () => {
        console.log("No more data");
      });
    });
  }

  listen(port: number, callback?: Function) {
    try {
      this.server.listen(port);

      callback(port);
    } catch (error) {
      console.error(error);
    }
  }
}
