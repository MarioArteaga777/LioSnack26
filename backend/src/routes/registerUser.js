import express from "express";
import registerUserController from "../controller/registerUsuarioController.js"
import rateLimiter from "../middlewares/rateLimiter.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router.route("/")
  .post(upload.single("image"), registerUserController.register);

router.route("/verifyCodeEmail")
  .post(rateLimiter, registerUserController.verifyCode);

router.route("/resendCode")
  .post(rateLimiter, registerUserController.resendCode);

export default router;