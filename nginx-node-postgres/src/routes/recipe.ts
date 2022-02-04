import { Router, Request, Response, NextFunction } from "express";

export const recipeRouter = Router();

recipeRouter.get("/recipe", function (req: Request, res: Response) {
  res.json("recipe");
});

recipeRouter.get("/recipes", function (req: Request, res: Response) {
  res.json("recipes");
});

recipeRouter.post("/recipe", function (req: Request, res: Response) {
  res.json("About birds");
});

recipeRouter.delete("/recipe/:id", function (req: Request, res: Response) {
  res.json("About birds");
});

recipeRouter.patch("/recipe/:id", function (req: Request, res: Response) {
  res.json("About birds");
});
