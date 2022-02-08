require("dotenv").config();

import { Recipe, Review, User } from "./models";

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

const dbInit = async () =>
  await Promise.all([
    // IMPORTANT!!!! The way of sync it important, as tables depend on each other
    User.sync({ alter: isDev || isTest }),
    Recipe.sync({ alter: isDev || isTest }),
    Review.sync({ alter: isDev || isTest }),
  ]);

export default dbInit;
