import * as http from "http";
import { Router } from "./router";
import { pathNameToRegex } from "./router/helper";
import { RequestParser } from "./router/requestParser";
const networkInterfaces = require("os").networkInterfaces();

export class Framework extends Router {
  server: http.Server;

  constructor() {
    super();

    this.server = http.createServer((req, res) =>
      this.serverListener(req, res)
    );
  }

  async serverListener(req: http.IncomingMessage, res: http.ServerResponse) {
    const { request, method, pathName } = new RequestParser(req);

    this.checkPaths(method, pathName, res);

    this.routeTable[method][pathName](request, res);
  }

  checkPaths(method: string, pathName: string, res: http.ServerResponse) {
    if (!this.routeTable[method]) {
      res.statusCode = 501;
      return res.end("No method /" + method);
    }

    if (!this.routeTable[method][pathName]) {
      res.statusCode = 501;

      return res.end(`No route ${pathName} found for method /${method}`);
    }
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
