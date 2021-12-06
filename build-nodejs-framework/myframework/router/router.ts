import * as http from "http";

import { IMethodCallback, IRequest } from "./domain.ts/irequests";
import {
  IMiddlewareCallback,
  IRouteTable,
  TMethods,
} from "./domain.ts/irouter";
import { pathNameToRegex } from "./helper";
import { Middleware } from "./middleware";
import { RequestParser } from "./requestParser";

export class Router {
  routeTable: IRouteTable;
  callbackQueue: IMiddlewareCallback[];

  constructor() {
    this.routeTable = {
      delete: {},
      get: {},
      post: {},
      patch: {},
    };
    this.callbackQueue = [];
  }

  use(fn: IMiddlewareCallback) {
    this.callbackQueue.push(fn);
  }

  get(path: string, cb: IMethodCallback) {
    // This way we can have the same path name with POST, GET, DELETE methods
    this.routeTable.get = {
      ...this.routeTable.get,
      [pathNameToRegex(path)]: cb,
    };
  }

  post(path: string, cb: IMethodCallback) {
    this.routeTable.post = {
      ...this.routeTable.post,
      [pathNameToRegex(path)]: cb,
    };
  }

  delete(path: string, cb: IMethodCallback) {
    this.routeTable.delete = {
      ...this.routeTable.delete,
      [pathNameToRegex(path)]: cb,
    };
  }

  patch(path: string, cb: IMethodCallback) {
    this.routeTable.patch = {
      ...this.routeTable.patch,
      [pathNameToRegex(path)]: cb,
    };
  }

  setCallbackFunction(cb: IMethodCallback) {
    this.callbackQueue.push(cb);

    return this;
  }

  executeResponse(req: IRequest, res: http.ServerResponse) {
    this.helperCbFunction(0, req, res);
    return this;
  }

  helperCbFunction(index, req: IRequest, res: http.ServerResponse) {
    if (index === this.callbackQueue.length) return;

    this.callbackQueue[index](req, res, () => {
      this.helperCbFunction(++index, req, res);
    });
  }

  useRequestParser(req: http.IncomingMessage) {
    return new RequestParser(req, this.routeTable);
  }

  findRouteCallback(method: TMethods, pathName: string) {
    if (!this.routeTable[method]) {
      throw new Error("No method /" + method);
    }

    if (!this.routeTable[method][pathName]) {
      throw new Error(`No route ${pathName} found for method /${method}`);
    }

    return this.routeTable[method][pathName];
  }
}
