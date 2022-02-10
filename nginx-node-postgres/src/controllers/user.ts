import { Request, Response } from "express";
import * as userService from "../services/user";

export const getUser = async function (req: Request, res: Response) {
  const id = req.params.id ? Number(req.params.id) : undefined;

  if (!id) {
    throw new Error("No id provided");
  }

  const user = await userService.getById(id);

  res.status(200).send(user);
};

export const listUsers = async function (req: Request, res: Response) {
  const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  const user = await userService.getAll({ limit, cursor });

  res.status(200).send(user);
};
