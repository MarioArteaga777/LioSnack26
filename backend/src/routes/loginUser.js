import express from "express";
import loginUserController from "../controllers/loginUserController.js";

const router = express.Router();

router.route("/").post(loginUserController.login);

export default router;