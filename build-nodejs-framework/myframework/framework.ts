import * as http from "http";
import { Router } from "./router";
import { TMethods } from "./router/domain.ts/irouter";

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
      const { request, method, pathName } = (
        await this.useRequestParser(req).parseBody()
      )
        .parseParams()
        .parsePathName()
        .parseQuery();

      const cb = this.findRouteCallback(method, pathName);

      this.setCallbackFunction(cb).executeResponse(request, res);
    } catch (error) {
      res.statusCode = 501;
      console.log(error);

      return res.end(error.message);
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
