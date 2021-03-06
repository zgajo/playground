import { Op } from "sequelize";
import {
  readOnlyConnection,
  insertOnlyConnection,
  deleteOnlyConnection,
  updateOnlyConnection,
} from "../db/config";
import { UserInput, UserOutput } from "../db/models/User";

const UserRead = readOnlyConnection.models.User;
const UserInsert = insertOnlyConnection.models.User;
const UserDelete = deleteOnlyConnection.models.User;
const UserUpdate = updateOnlyConnection.models.User;

export const getAll = async (params: {
  filters?: UserInput;
  limit?: number;
  cursor?: number;
}): Promise<UserOutput[]> => {
  const cursor = params.cursor
    ? {
        id: {
          [Op.gt]: params.cursor,
        },
      }
    : null;

  const users = await UserRead.findAll({
    limit: params.limit,
    where: {
      ...params.filters,
      ...cursor,
    },
  });

  return users;
};

export const getById = async (id: number): Promise<UserOutput> => {
  const user = await UserRead.findByPk(id);

  if (!user) {
    // @todo throw custom error
    throw new Error("not found");
  }

  return user;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedUserCount = await UserDelete.destroy({
    where: { id },
  });

  return !!deletedUserCount;
};

export const update = async (
  id: number,
  payload: Partial<UserInput>
): Promise<UserOutput> => {
  const user = await UserRead.findByPk(id);

  if (!user) {
    // @todo throw custom error
    throw new Error("not found");
  }

  const [, users] = await UserUpdate.update(payload, { where: { id } });

  const updatedUser = users[0];

  return updatedUser;
};

export const create = async (payload: UserInput): Promise<UserOutput> => {
  const user = await UserInsert.create(payload);

  return user;
};
