import { IMethodCallback } from "./requests";

export type TMethods = "get" | "post" | "delete" | "patch";

export type IRouteTable = {
  [K in TMethods]: { [pathname: string]: IMethodCallback };
};
