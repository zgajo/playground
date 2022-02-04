import express, { Request, Response, NextFunction } from "express";
import sequelizeConnection from "./db/config";
import dbInit from "./db/init";

dbInit();

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}.`);
});
