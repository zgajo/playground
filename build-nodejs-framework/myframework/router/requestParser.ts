import * as http from "http";
import { URLSearchParams } from "url";

interface IRequest extends http.IncomingMessage {
  params: {};
  query: {};
  body: {};
}

export class RequestParser {
  constructor() {}

  async parse(req: http.IncomingMessage) {
    let request: IRequest = {
      ...req,
      params: {},
      query: {},
      body: {},
    } as IRequest;

    const url = new URL(req.url, `http://${req.headers.host}`);

    request.body = (await this.parseBody(req)) || {};
    request.params = this.parseParams(url.pathname) || {};
    request.query = this.parseQuery(url.searchParams) || {};

    return request;
  }

  findRoute(req: http.IncomingMessage) {
    req.method.toLowerCase();
  }

  parseParams(pathname: string): { [key: string]: string } {
    // pathname.match(new RegExp());
    return;
  }

  parseQuery(queryParams: URLSearchParams): { [key: string]: string } {
    let query = {};

    for (const [key, value] of queryParams.entries()) {
      query = { ...query, [key]: value };
    }

    return query;
  }
  async parseBody(
    req: http.IncomingMessage
  ): Promise<{ [key: string]: string }> {
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

    return body;
  }
}
