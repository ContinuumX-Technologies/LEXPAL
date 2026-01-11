import express from "express";
import cookieParser from "cookie-parser"

import cors from "cors";

import authRouter from "./src/routes/auth.route.js";
import uploadRouter from "./src/routes/upload.route.js";
import AIRouter from "./src/routes/AI.route.js";
import userRouter from "./src/routes/user.route.js";
import exploreRouter from "./src/routes/explore.route.js";


const app = express();



app.use(cors({
  origin: "https://lexpal.in",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


//routes
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/AI",AIRouter);
app.use("/api/user", userRouter);
app.use("/api/explore", exploreRouter);





export default app;