import { Request, Response, Router } from "express";
import * as recipeController from "../controllers/recipe";

export const recipeRouter = Router();

recipeRouter.get("/recipe/:id", recipeController.getRecipe);

recipeRouter.get("/recipes", recipeController.listRecipes);

recipeRouter.post("/recipe", function (req: Request, res: Response) {
  res.json("About birds");
});

recipeRouter.delete("/recipe/:id", function (req: Request, res: Response) {
  res.json("About birds");
});

recipeRouter.patch("/recipe/:id", function (req: Request, res: Response) {
  res.json("About birds");
});
