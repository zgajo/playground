import * as http from "http";

export interface IRequest extends http.IncomingMessage {
  params: {};
  query: {};
  body: {};
}

export type IMethodCallback = (req: IRequest, res: http.ServerResponse) => void;
