import express from "express";
import protectRoute from "../middlewares/auth.middleware.js"
import { recentConversationLoader, deleteConversation, renameConversation } from "../controllers/AI_convo.controller.js";
import { getConversationHistory } from "../controllers/convo_history.controller.js";
import noCacheMiddleware from "../middlewares/cache.middleware.js";

const AIRouter = express.Router();


AIRouter.get("/recent-conversation", protectRoute, noCacheMiddleware, recentConversationLoader);
AIRouter.get("/convo-history/:convoId", protectRoute, getConversationHistory);
AIRouter.delete("/conversation/:convoId", protectRoute, deleteConversation);
AIRouter.put("/conversation/:convoId", protectRoute, renameConversation);


export default AIRouter;

