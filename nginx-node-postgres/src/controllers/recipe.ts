import { Request, Response } from "express";
import * as recipeService from "../services/recipe";

export const getRecipe = async function (req: Request, res: Response) {
  const id = Number(req.params.id);

  const recipe = await recipeService.getById(id);

  res.status(200).send(recipe);
};

export const listRecipes = async function (req: Request, res: Response) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const recipe = await recipeService.getAll();

  res.status(200).send(recipe);
};
