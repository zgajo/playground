import * as http from "http";
import { IMethodCallback } from "./irequests";

export type TMethods = "get" | "post" | "delete" | "patch";

export type IRouteTable = {
  [K in TMethods]: { [pathname: string]: IMethodCallback };
};

const generatorFnNext = (function* () {
  yield;
})().next;

export type IMiddlewareCallback = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
) => void;
