import * as http from "http";
import { IRequest } from "./domain.ts/irequests";
import { IRouteTable, TMethods } from "./domain.ts/irouter";

export class RequestParser {
  url: URL;
  pathName: string;
  method: TMethods;
  request: IRequest;
  routeTable: IRouteTable;
  req: http.IncomingMessage;

  constructor(req: http.IncomingMessage, routeTable: IRouteTable) {
    this.req = req;
    this.parseMethod();

    this.url = new URL(req.url, `http://${req.headers.host}`);
    this.routeTable = routeTable;

    this.request = {
      ...req,
      params: {},
      query: {},
      body: {},
    } as IRequest;
  }

  parsePathName() {
    for (const regexPath of Object.keys(this.routeTable[this.method])) {
      const match = this.url.pathname.match(new RegExp(regexPath));

      // Doing this extra check because getting the matching result for "/" === "/products/:id"
      if (match && match[0] === match.input) {
        this.pathName = regexPath;

        return this;
      }
    }

    return this;
  }

  parseParams() {
    for (const regexPath of Object.keys(this.routeTable[this.method])) {
      const match = this.url.pathname.match(new RegExp(regexPath));

      // Doing this extra check because getting the matching result for "/" === "/products/:id"
      if (match && match[0] === match.input) {
        this.request.params = { ...match.groups };
        return this;
      }
    }

    return this;
  }

  private parseMethod() {
    switch (this.req.method.toLowerCase()) {
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
    return this;
  }

  parseQuery() {
    let query = {};

    for (const [key, value] of this.url.searchParams.entries()) {
      query = { ...query, [key]: value };
    }

    this.request.query = query;

    return this;
  }
  async parseBody() {
    /**
     * The key thing to understand is that when you initialize the HTTP server using http.createServer(), the callback is called when the server got all the HTTP headers, but not the request body.
     * So to access the data, we must concatenate the chunks into a string when listening to the stream data, and when the stream end, we parse the string to JSON:
     * https://nodejs.dev/learn/get-http-request-body-data-using-nodejs
     */
    const buffers = [];

    for await (const chunk of this.req) {
      buffers.push(chunk);
    }

    const data = Buffer.concat(buffers).toString();

    const body = JSON.parse(data);

    this.request.body = body;

    return this;
  }
}
