import express from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import noCacheMiddleware from "../middlewares/cache.middleware.js";
import { isLawyerSaved, savedLawyerLoader, saveLawyer, unsaveLawyer } from "../controllers/saved_lawyer.controller.js";

import { getChatProfile } from "../controllers/chatProfile.controller.js";
import { getChatHistory } from "../controllers/userChatHistory.controller.js";
import { getChatList } from "../controllers/chatList.controller.js";
import getName from "../controllers/userDetails.controller.js";


const userRouter= express.Router();

userRouter.get("/saved-lawyers/fetch/all-saved",protectRoute,noCacheMiddleware,savedLawyerLoader);
userRouter.post("/saved-lawyers/update/new-save/:lawyerId",protectRoute,saveLawyer);
userRouter.delete("/saved-lawyers/update/delete-saved-lawyer/:lawyerId",protectRoute,unsaveLawyer);
userRouter.get("/saved-lawyers/fetch/isLawyerSaved/:lawyerId",protectRoute,isLawyerSaved);
userRouter.get("/chat/profile/:id", protectRoute, getChatProfile);
userRouter.get("/chat/list", protectRoute,noCacheMiddleware, getChatList);
userRouter.get("/username",protectRoute,getName);

userRouter.get(
  "/chat/history/:receiverId",
  protectRoute,
  getChatHistory
);
export default userRouter;