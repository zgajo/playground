import * as recipeDal from "../dal/recipe";
import { RecipeInput, RecipeOutput } from "../db/models/Recipe";

export const create = async (payload: RecipeInput): Promise<RecipeOutput> => {
  return recipeDal.create(payload);
};

export const getById = async (id: number): Promise<RecipeOutput> => {
  return recipeDal.getById(id);
};

export const update = async (
  id: number,
  payload: Partial<RecipeInput>
): Promise<RecipeOutput> => {
  return recipeDal.update(id, payload);
};

export const deleteById = async (id: number): Promise<boolean> => {
  return recipeDal.deleteById(id);
};

export const getAll = async (
  filters?: RecipeInput
): Promise<RecipeOutput[]> => {
  return recipeDal.getAll(filters);
};
