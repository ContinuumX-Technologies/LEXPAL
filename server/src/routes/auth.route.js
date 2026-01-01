import express from "express";
import {userSignup , userLogin} from "../controllers/user_auth.controller.js";
import {lawyerSignup , lawyerLogin} from "../controllers/lawyer_auth.controller.js";


const authRouter= express.Router();

authRouter.post("/user-signup",userSignup);
authRouter.post("/user-login", userLogin);


authRouter.post("/lawyer-signup",lawyerSignup);
authRouter.post("/lawyer-login",lawyerLogin);

export default authRouter;