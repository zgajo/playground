import * as reviewDal from "../dal/review";
import { ReviewInput, ReviewOutput } from "../db/models/Review";

export const create = (payload: ReviewInput): Promise<ReviewOutput> => {
  return reviewDal.create(payload);
};

export const update = (
  id: number,
  payload: Omit<ReviewInput, "isPublished" | "publishedOn">
): Promise<ReviewOutput> => {
  return reviewDal.update(id, payload);
};

export const getById = (id: number): Promise<ReviewOutput> => {
  return reviewDal.getById(id);
};

export const deleteById = (id: number): Promise<boolean> => {
  return reviewDal.deleteById(id);
};

export const getAll = (filters: ReviewInput): Promise<ReviewOutput[]> => {
  return reviewDal.getAll(filters);
};

export const publishReview = (id: number): Promise<ReviewOutput> => {
  return reviewDal.update(id, {
    isPublished: true,
    publishedOn: new Date(),
  });
};

export const unpublishReview = (id: number): Promise<ReviewOutput> => {
  return reviewDal.update(id, {
    isPublished: false,
    publishedOn: null,
  });
};
