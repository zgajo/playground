import express from "express";
import { apiRouter } from "./routes/api";
import { recipeRouter } from "./routes/recipe";
import { reviewRouter } from "./routes/review";
import { userRouter } from "./routes/user";
const app = express();
const port = 3000;

export const startServer = () => {
  app.use(express.json());

  app.use(apiRouter);

  app.get("/", (req, res) => {
    res.send(`Hello from world ${process.env.APP_NO || "localhost"}`);
  });

  app.get("/auth_0_user", (req, res) => {
    res.send(`Hello from world ${process.env.APP_NO || "localhost"}`);
  });

  app.listen(port, () => {
    console.log(`Running on http://localhost:${port}.`);
  });
};
