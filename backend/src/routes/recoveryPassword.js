import express from "express";
import recoveryPasswordController from "../controller/recoveryPasswordController.js";
import rateLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

router.route("/requestCode")
  .post(rateLimiter, recoveryPasswordController.requestCode);

router.route("/verifyCode")
  .post(rateLimiter, recoveryPasswordController.verifyCode);

router.route("/newPassword")
  .post(recoveryPasswordController.newPassword);

export default router;
