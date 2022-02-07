require("dotenv").config();
import express from "express";
import { createConnection } from "./db";
import { recipeRouter } from "./routes/recipe";
import { reviewRouter } from "./routes/review";
import { userRouter } from "./routes/user";
const app = express();
const port = 3000;

console.log(process.env.APP_NO);

const startApp = async () => {
  await createConnection();

  app.use(userRouter);
  app.use(recipeRouter);
  app.use(reviewRouter);

  app.get("/", (req, res) => {
    res.send(`Hello from world ${process.env.APP_NO || "localhost"}`);
  });

  app.listen(port, () => {
    console.log(`Running on http://localhost:${port}.`);
  });
};

startApp();
