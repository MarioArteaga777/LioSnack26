import jsonbwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import HTMLRecoveryEmail from "../utils/sendMailRecoveryPassword.js";

import { config } from "../config.js";

import userModel from "../models/users.js";

const recoveryPasswordController = {};

recoveryPasswordController.requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    const userFound = await userModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "user not found" });
    }

    const randomCode = crypto.randomBytes(3).toString("hex");

    const token = jsonbwebtoken.sign(
      { email, randomCode, userType: "User", verified: false },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Código de recuperación de contraseña",
      body: "El código vence en 15 minutos",
      html: HTMLRecoveryEmail(randomCode),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error al enviar correo" });
      }
    });

    return res.status(200).json({ message: "email sent" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;

    const token = req.cookies.recoveryCookie;
    const decoded = jsonbwebtoken.verify(token, config.JWT.secret);

    if (code !== decoded.randomCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const newToken = jsonbwebtoken.sign(
      { email: decoded.email, userType: "User", verified: true },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

recoveryPasswordController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "passwords doesnt match" });
    }

    const token = req.cookies.recoveryCookie;
    const decoded = jsonbwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "code not virified" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await userModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true },
    );

    res.clearCookie("recoveryCookie");

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default recoveryPasswordController;