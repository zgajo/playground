import { Request, Response } from "express";
import * as userService from "../services/user";

export const getUser = async function (req: Request, res: Response) {
  const id = Number(req.params.id);

  const user = await userService.getById(id);

  res.status(200).send(user);
};

export const listUsers = async function (req: Request, res: Response) {
  const cursor = Number(req.query.cursor);
  const limit = Number(req.query.limit);

  const user = await userService.getAll({ limit, cursor });

  res.status(200).send(user);
};
