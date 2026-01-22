import express from "express";
import uploader from "../middlewares/upload_file.middleware.js"
import protectRoute from "../middlewares/auth.middleware.js";
import { profilePicUploader } from "../controllers/upload.controller.js";

const uploadRouter = express.Router();

uploadRouter.post("/profile-pic", protectRoute, uploader.single("profile_picture"), profilePicUploader);

export default uploadRouter;