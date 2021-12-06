import { IMiddlewareCallback } from "./domain.ts/irouter";

export class Middleware {
  middlewareCallback: IMiddlewareCallback;
  constructor(cb: IMiddlewareCallback) {
    this.middlewareCallback = cb;
  }
}
