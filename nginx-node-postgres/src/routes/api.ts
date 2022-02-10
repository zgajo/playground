import { Router } from "express";
import { recipeRouter } from "./recipe";
import { reviewRouter } from "./review";
import { userRouter } from "./user";

export const apiRouter = Router();

apiRouter.use("/api", userRouter);
apiRouter.use("/api", recipeRouter);
apiRouter.use("/api", reviewRouter);
