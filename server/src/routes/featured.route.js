import express from "express";
import protectRoute from "../middlewares/auth.middleware";

const featuredRouter= express.Router();

featuredRouter.get("/featured-list/fetch/",protectRoute,);