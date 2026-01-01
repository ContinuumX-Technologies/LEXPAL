import express from "express";
import { fetchLawyerById, fetchLawyers } from "../controllers/fetch_lawyers.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";


const exploreRouter= express.Router();

exploreRouter.get("/fetch/all-lawyers",fetchLawyers);
exploreRouter.get("/fetch/lawyer/:lawyerId",protectRoute,fetchLawyerById);

export default exploreRouter;