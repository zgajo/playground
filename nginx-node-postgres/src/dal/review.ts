import {
  readOnlyConnection,
  insertOnlyConnection,
  deleteOnlyConnection,
  updateOnlyConnection,
} from "../db/config";
import { ReviewInput, ReviewOutput } from "../db/models/Review";

const ReviewRead = readOnlyConnection.models.Review;
const ReviewInsert = insertOnlyConnection.models.Review;
const ReviewDelete = deleteOnlyConnection.models.Review;
const ReviewUpdate = updateOnlyConnection.models.Review;

export const getAll = async (
  filters: Omit<ReviewInput, "meta">
): Promise<ReviewOutput[]> => {
  const users = await ReviewRead.findAll({
    where: filters,
  });

  return users;
};

export const getById = async (id: number): Promise<ReviewOutput> => {
  const recipe = await ReviewRead.findByPk(id);

  if (!recipe) {
    // @todo throw custom error
    throw new Error("not found");
  }

  return recipe;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedReviewCount = await ReviewDelete.destroy({
    where: { id },
  });

  return !!deletedReviewCount;
};

export const update = async (
  id: number,
  payload: Partial<ReviewInput>
): Promise<ReviewOutput> => {
  const recipe = await ReviewRead.findByPk(id);

  if (!recipe) {
    // @todo throw custom error
    throw new Error("not found");
  }

  const [, recipes] = await ReviewUpdate.update(payload, { where: { id } });

  const updatedReview = recipes[0];

  return updatedReview;
};

export const create = async (payload: ReviewInput): Promise<ReviewOutput> => {
  const recipe = await ReviewInsert.create(payload);

  return recipe;
};
