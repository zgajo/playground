import * as http from "http";

export class Router {
  routeTable: {
    get?: {};
    post?: {};
    delete?: {};
    patch?: {};
  };

  constructor() {
    this.routeTable = {};
  }

  get(
    path: string,
    cb: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ) {
    // This way we can have /path with POST, GET, DELETE methods
    this.routeTable.get = { ...this.routeTable.get, path: cb };
  }

  post(
    path: string,
    cb: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ) {
    this.routeTable.post = { ...this.routeTable.post, path: cb };
  }

  delete(
    path: string,
    cb: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ) {
    this.routeTable.delete = { ...this.routeTable.delete, path: cb };
  }

  patch(
    path: string,
    cb: (req: http.IncomingMessage, res: http.ServerResponse) => void
  ) {
    this.routeTable.patch = { ...this.routeTable.patch, path: cb };
  }
}
