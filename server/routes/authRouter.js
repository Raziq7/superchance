import express from "express";
import {loginController, userLogoutController } from "../controller/authController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";

var router = express.Router();

// login admin
router.route("/login").post(loginController);

router.route("/logout").post(userLogoutController);


export default router;
