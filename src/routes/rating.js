import express from "express";
import { isAdmin, isLoggedIn } from "../middlewares/auth.js";
 import { rateProduct } from "../controller/rating.js";

export const ratingRouter = express.Router();

ratingRouter.post("/create", isLoggedIn, rateProduct);