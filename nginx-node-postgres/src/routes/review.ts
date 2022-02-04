import { Router, Request, Response, NextFunction } from "express";

export const reviewRouter = Router();

reviewRouter.get("/review", function (req: Request, res: Response) {
  res.json("Birds home page");
});

reviewRouter.get("/reviews", function (req: Request, res: Response) {
  res.json("About birds");
});

reviewRouter.post("/review", function (req: Request, res: Response) {
  res.json("About birds");
});

reviewRouter.delete("/review/:id", function (req: Request, res: Response) {
  res.json("About birds");
});

reviewRouter.patch("/review/:id", function (req: Request, res: Response) {
  res.json("About birds");
});
