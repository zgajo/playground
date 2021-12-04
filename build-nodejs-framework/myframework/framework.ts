import * as http from "http";
import { Router } from "./router";
import { TMethods } from "./router/domain.ts/router";

import { RequestParser } from "./router/requestParser";

export class Framework extends Router {
  server: http.Server;

  constructor() {
    super();

    this.server = http.createServer((req, res) =>
      this.serverListener(req, res)
    );
  }

  async serverListener(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const { request, method, pathName } = new RequestParser(
        req,
        this.routeTable
      );

      this.checkPaths(method, pathName);

      // execute the router callback function
      this.routeTable[method][pathName](request, res);
    } catch (error) {
      res.statusCode = 501;

      return res.end(error.message);
    }
  }

  checkPaths(method: TMethods, pathName: string) {
    console.log(method, pathName);
    if (!this.routeTable[method]) {
      throw new Error("No method /" + method);
    }

    if (!this.routeTable[method][pathName]) {
      throw new Error(`No route ${pathName} found for method /${method}`);
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
