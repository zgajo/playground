import * as userDal from "../dal/user";
import { UserInput, UserOutput } from "../db/models/User";

export const create = async (payload: UserInput): Promise<UserOutput> => {
  return userDal.create(payload);
};

export const getById = async (id: number): Promise<UserOutput> => {
  return userDal.getById(id);
};

export const update = async (
  id: number,
  payload: Partial<UserInput>
): Promise<UserOutput> => {
  return userDal.update(id, payload);
};

export const deleteById = async (id: number): Promise<boolean> => {
  return userDal.deleteById(id);
};

export const getAll = async (params: {
  filters?: UserInput;
  limit?: number;
  cursor?: number;
}): Promise<UserOutput[]> => {
  return await userDal.getAll(params);
};
