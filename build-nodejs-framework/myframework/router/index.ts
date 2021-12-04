import { IMethodCallback, TMethods } from "./domain.ts/requests";
import { pathNameToRegex } from "./helper";

export class Router {
  routeTable: {
    [K in TMethods]: { [pathname: string]: IMethodCallback };
  };

  constructor() {
    this.routeTable = {
      delete: {},
      get: {},
      post: {},
      patch: {},
    };
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
}
