import * as http from "http";
import { URLSearchParams } from "url";

interface IRequest extends http.IncomingMessage {
  params: {};
  query: {};
  body: {};
}

export class RequestParser {
  constructor() {}

  parse(req: http.IncomingMessage) {
    let request: IRequest = {
      ...req,
      params: {},
      query: {},
      body: {},
    } as IRequest;

    const url = new URL(req.url, `http://${req.headers.host}`);

    request = this.parseParams(url.pathname);
    request = this.parseQuery(url.searchParams);
    // request = this.parseBody();
  }

  parseParams(pathname: string): IRequest {
    return;
  }
  parseQuery(queryParams: URLSearchParams): IRequest {
    return;
  }
  parseBody(path): IRequest {
    return;
  }
}
