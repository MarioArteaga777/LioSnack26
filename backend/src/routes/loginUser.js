import express from "express";
import loginUserController from "../controller/loginUserController.js";
import logoutController from "../controller/logoutController.js";

const router = express.Router();

router.route("/").post(loginUserController.login);
router.route("/logout").post(logoutController.logout);

export default router;
