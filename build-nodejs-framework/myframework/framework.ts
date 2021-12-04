import * as http from "http";
import { Router } from "./router";
import { pathNameToRegex } from "./router/helper";
import { RequestParser } from "./router/requestParser";
const networkInterfaces = require("os").networkInterfaces();

const requestParser = new RequestParser();

export class Framework extends Router {
  server: http.Server;

  constructor() {
    super();

    this.server = http.createServer((req, res) =>
      this.createServerListener(req, res)
    );
  }

  async createServerListener(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    let method = req.method.toLowerCase();

    switch (method) {
      case "get":
        method = "get";
        break;

      default:
        break;
    }

    if (!this.routeTable[method].) {
      res.statusCode = 501;
      return res.end("No method /" + method);
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathName = pathNameToRegex(url.pathname);

    if (!this.routeTable[method][pathName]) {
      res.statusCode = 501;

      return res.end(`No route ${pathName} found for method /${method}`);
    }

    // Create query, params and body object with data
    const request = await requestParser.parse(req);

    this.routeTable[method][pathName](request, res);
  }

  listen(port: number, callback?: Function) {
    try {
      console.log("1");
      this.server.listen(port);

      callback(port);
    } catch (error) {
      console.error(error);
    }
  }
}
