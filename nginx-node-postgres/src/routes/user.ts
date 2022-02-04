import { Router, Request, Response, NextFunction } from "express";

export const userRouter = Router();

userRouter.get("/user", function (req: Request, res: Response) {
  res.json("Birds home page");
});

userRouter.get("/users", function (req: Request, res: Response) {
  res.json("About birds");
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
