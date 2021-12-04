import * as http from "http";
import { IRequest, TMethods } from "./domain.ts/requests";
import { pathNameToRegex } from "./helper";

export class RequestParser {
  url: URL;
  pathName: string;
  method: TMethods;
  request: IRequest;

  constructor(req: http.IncomingMessage) {
    this.request = <IRequest>{
      ...req,
      params: {},
      query: {},
      body: {},
    };
    this.url = new URL(req.url, `http://${req.headers.host}`);

    this.pathName = pathNameToRegex(this.url.pathname);

    this.parseMethod(req.method.toLowerCase());

    this.parseBody(req);
    this.parseParams();
    this.parseQuery();
  }

  findRoute(req: http.IncomingMessage) {
    req.method.toLowerCase();
  }

  parseMethod(met: string) {
    switch (met) {
      case "get":
        this.method = "get";
        break;
      case "delete":
        this.method = "delete";
        break;
      case "post":
        this.method = "post";
        break;
      case "patch":
        this.method = "patch";
        break;

      default:
        break;
    }
  }

  parseParams() {
    // pathname.match(new RegExp());
    return;
  }

  parseQuery() {
    let query = {};

    for (const [key, value] of this.url.searchParams.entries()) {
      query = { ...query, [key]: value };
    }

    this.request.query = query;
  }
  async parseBody(req: http.IncomingMessage) {
    /**
     * The key thing to understand is that when you initialize the HTTP server using http.createServer(), the callback is called when the server got all the HTTP headers, but not the request body.
     * So to access the data, we must concatenate the chunks into a string when listening to the stream data, and when the stream end, we parse the string to JSON:
     * https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
     */
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const data = Buffer.concat(buffers).toString();

    const body = JSON.parse(data);

    this.request.body = body;
  }
}
