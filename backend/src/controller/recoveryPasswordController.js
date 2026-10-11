import jsonbwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/sendMailMailjet.js";
import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";

import { config } from "../config.js";
import userModel from "../models/user.js";

const recoveryPasswordController = {};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000,
};

/**
 * Extrae el token de recuperación desde la cookie (web) o desde el header
 * Authorization: Bearer <token> (apps móviles, que no soportan cookies).
 * @param {import("express").Request} req
 * @returns {string|null}
 */
function extractRecoveryToken(req) {
  // 1. Prioridad: cookie (flujo web normal)
  if (req.cookies?.recoveryCookie) {
    return req.cookies.recoveryCookie;
  }
  // 2. Fallback: Authorization header (flujo móvil)
  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

recoveryPasswordController.requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El correo es requerido" });
    }

    const normalizedEmail = email.toLowerCase();

    const userFound = await userModel.findOne({ email: normalizedEmail });

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const randomCode = crypto.randomInt(100000, 1000000).toString();

    const token = jsonbwebtoken.sign(
      { email: normalizedEmail, randomCode, userType: "User", verified: false },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    // Cookie para clientes web
    res.cookie("recoveryCookie", token, cookieOptions);

    try {
      await sendEmail(normalizedEmail, "Código de recuperación de contraseña", HTMLRecoveryEmail(randomCode));
    } catch (mailError) {
      console.log("mail error:", mailError.message);
      return res.status(500).json({ message: "Error al enviar correo" });
    }

    // También devolvemos el token en el body para clientes móviles
    // que no pueden acceder al header Set-Cookie
    return res.status(200).json({ message: "email sent", recoveryToken: token });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "El código es requerido" });
    }

    const token = extractRecoveryToken(req);
    if (!token) {
      return res.status(400).json({ message: "Solicita un nuevo código de recuperación" });
    }

    let decoded;
    try {
      decoded = jsonbwebtoken.verify(token, config.JWT.secret);
    } catch {
      return res.status(400).json({ message: "El código expiró, solicita uno nuevo" });
    }

    if (String(code) !== decoded.randomCode) {
      return res.status(400).json({ message: "Código inválido" });
    }

    const newToken = jsonbwebtoken.sign(
      { email: decoded.email, userType: "User", verified: true },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    // Cookie para clientes web
    res.cookie("recoveryCookie", newToken, cookieOptions);

    // Token en body para clientes móviles
    return res.status(200).json({ message: "Code verified successfully", recoveryToken: newToken });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

recoveryPasswordController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword || newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const token = extractRecoveryToken(req);
    if (!token) {
      return res.status(400).json({ message: "Solicita un nuevo código de recuperación" });
    }

    let decoded;
    try {
      decoded = jsonbwebtoken.verify(token, config.JWT.secret);
    } catch {
      return res.status(400).json({ message: "La sesión de recuperación expiró, solicita un nuevo código" });
    }

    if (!decoded.verified) {
      return res.status(400).json({ message: "Debes verificar el código antes de continuar" });
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