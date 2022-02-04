import express, { Request, Response, NextFunction } from "express";
import sequelizeConnection from "./db/config";
import dbInit from "./db/init";
import { recipeRouter } from "./routes/recipe";
import { reviewRouter } from "./routes/review";
import { userRouter } from "./routes/user";

dbInit();

const app = express();
const port = 3000;

app.use(userRouter);
app.use(recipeRouter);
app.use(reviewRouter);

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}.`);
});
