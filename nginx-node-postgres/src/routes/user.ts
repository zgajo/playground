import { Router, Request, Response, NextFunction } from "express";

export const userRouter = Router();

userRouter.get("/user", function (req: Request, res: Response) {
  res.json("user");
});

userRouter.get("/users", function (req: Request, res: Response) {
  res.json("users");
});

userRouter.post("/user", function (req: Request, res: Response) {
  res.json("About birds");
});

userRouter.delete("/user/:id", function (req: Request, res: Response) {
  res.json("About birds");
});

userRouter.patch("/user/:id", function (req: Request, res: Response) {
  res.json("About birds");
});
