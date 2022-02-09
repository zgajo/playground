import {
  readOnlyConnection,
  insertOnlyConnection,
  deleteOnlyConnection,
  updateOnlyConnection,
} from "../db/config";
import { RecipeInput, RecipeOutput } from "../db/models/Recipe";

const RecipeRead = readOnlyConnection.models.Recipe;
const RecipeInsert = insertOnlyConnection.models.Recipe;
const RecipeDelete = deleteOnlyConnection.models.Recipe;
const RecipeUpdate = updateOnlyConnection.models.Recipe;

export const getAll = async (
  filters: Omit<RecipeInput, "meta">
): Promise<RecipeOutput[]> => {
  const users = await RecipeRead.findAll({
    where: filters,
  });

  return users;
};

export const getById = async (id: number): Promise<RecipeOutput> => {
  const recipe = await RecipeRead.findByPk(id);

  if (!recipe) {
    // @todo throw custom error
    throw new Error("not found");
  }

  return recipe;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedRecipeCount = await RecipeDelete.destroy({
    where: { id },
  });

  return !!deletedRecipeCount;
};

export const update = async (
  id: number,
  payload: Partial<RecipeInput>
): Promise<RecipeOutput> => {
  const recipe = await RecipeRead.findByPk(id);

  if (!recipe) {
    // @todo throw custom error
    throw new Error("not found");
  }

  const [, recipes] = await RecipeUpdate.update(payload, { where: { id } });

  const updatedRecipe = recipes[0];

  return updatedRecipe;
};

export const create = async (payload: RecipeInput): Promise<RecipeOutput> => {
  const recipe = await RecipeInsert.create(payload);

  return recipe;
};
