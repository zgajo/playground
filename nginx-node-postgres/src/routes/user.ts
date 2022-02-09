import { Router, Request, Response, NextFunction } from "express";
import * as userController from "../controllers/user";

export const userRouter = Router();

userRouter.get("/user/:id", userController.getUser);

userRouter.get("/users", userController.listUsers);

userRouter.post("/user", function (req: Request, res: Response) {
  res.json("About birds");
});

userRouter.delete("/user/:id", function (req: Request, res: Response) {
  res.json("About birds");
});

userRouter.patch("/user/:id", function (req: Request, res: Response) {
  res.json("About birds");
});
