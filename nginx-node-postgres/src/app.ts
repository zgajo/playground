import express from "express";
import { createConnection } from "./db";
import { recipeRouter } from "./routes/recipe";
import { reviewRouter } from "./routes/review";
import { userRouter } from "./routes/user";
const app = express();
const port = 3000;

const startApp = async () => {
  await createConnection();

  app.use(userRouter);
  app.use(recipeRouter);
  app.use(reviewRouter);

  app.listen(port, () => {
    console.log(`Running on http://localhost:${port}.`);
  });
};

startApp();
