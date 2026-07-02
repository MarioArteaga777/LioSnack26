import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import userModel from "../models/user.js";
import { config } from "../config.js";

const registerUserController = {};

registerUserController.register = async (req, res) => {
  try {
    let { name, lastName, email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    const existUser = await userModel.findOne({ email: normalizedEmail });
    if (existUser) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newUser = new userModel({
      name,
      lastName,
      email: normalizedEmail,
      password: passwordHash
    });

    await newUser.save();

    const verificationCode = crypto.randomBytes(3).toString("hex");

    const tokenCode = jsonwebtoken.sign(
      { email: normalizedEmail, verificationCode },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("verificationTokenCookie", tokenCode, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: normalizedEmail,
      subject: "Verificación de cuenta",
      text: `Para verificar tu cuenta, utiliza este código: ${verificationCode} (expira en 15 minutos)`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar email: " + error);
        return res.status(500).json({ message: "Error al enviar el correo de verificación" });
      }

      return res.status(200).json({ message: "Correo de verificación enviado con éxito" });
    });

  } catch (error) {
    console.error("Error en el registro: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

registerUserController.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest } = req.body;
    const token = req.cookies.verificationTokenCookie;

    if (!token) {
      return res.status(400).json({ message: "Código expirado o inexistente" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { email, verificationCode: storedCode } = decoded;

    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "Código inválido" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isVerified = true;
    await user.save();

    res.clearCookie("verificationTokenCookie");

    return res.json({ message: "Cuenta verificada con éxito" });
  } catch (error) {
    console.error("Error en la verificación: " + error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "El código ha expirado" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerUserController;