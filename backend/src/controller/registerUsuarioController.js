import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../utils/sendMailMailjet.js";
import HTMLVerificationEmail from "../utils/sendMailVerification.js";
import userModel from "../models/user.js";
import pendingRegistrationModel from "../models/pendingRegistration.js";

const registerUserController = {};

const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;
const PENDING_REGISTRATION_TTL_MS = 24 * 60 * 60 * 1000;

// Mantiene los registros incompletos fuera de la colección de usuarios.
const issueVerificationCode = async (registration, isPending = false) => {
  const code = crypto.randomInt(100000, 1000000).toString();

  registration.verificationCode = await bcryptjs.hash(code, 10);
  registration.verificationCodeExpires = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);
  if (isPending) {
    registration.expiresAt = new Date(Date.now() + PENDING_REGISTRATION_TTL_MS);
  }
  await registration.save();

  await sendEmail(registration.email, "Verifica tu cuenta de LioSnacks", HTMLVerificationEmail(code));
};

// Guarda la cuenta como pendiente y envía el código de verificación.
registerUserController.register = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    if (typeof email !== "string") {
      return res.status(400).json({ message: "El correo no es válido" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser?.isVerified) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);
    const pendingRegistration = await pendingRegistrationModel.findOne({ email: normalizedEmail })
      || new pendingRegistrationModel({ email: normalizedEmail });

    pendingRegistration.name = name;
    pendingRegistration.lastName = lastName;
    pendingRegistration.password = passwordHash;
    pendingRegistration.image = req.file?.path || null;
    pendingRegistration.public_id = req.file?.filename || null;

    try {
      if (existingUser) {
        await issueVerificationCode(existingUser);
        return res.status(200).json({
          message: "Ya había un registro pendiente. Se envió un nuevo código de verificación.",
        });
      }

      await issueVerificationCode(pendingRegistration, true);
    } catch (mailError) {
      console.error("Error sending verification email: " + mailError);
      return res.status(500).json({
        message: "No se pudo enviar el código. Intenta registrarte nuevamente.",
      });
    }

    return res.status(202).json({
      message: "Registro pendiente. Se envió un código de verificación al correo.",
    });
  } catch (error) {
    console.error("Registration error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Valida el código de verificación enviado por correo y activa la cuenta
registerUserController.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Correo y código son requeridos" });
    }

    if (typeof email !== "string" || typeof code !== "string") {
      return res.status(400).json({ message: "Correo y código no son válidos" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const pendingRegistration = await pendingRegistrationModel.findOne({ email: normalizedEmail });

    if (!pendingRegistration) {
      const existingUser = await userModel.findOne({ email: normalizedEmail });
      if (!existingUser) {
        return res.status(404).json({ message: "Registro pendiente no encontrado. Regístrate nuevamente." });
      }

      if (existingUser.isVerified) {
        return res.status(200).json({ message: "La cuenta ya estaba verificada" });
      }

      if (!existingUser.verificationCode || !existingUser.verificationCodeExpires) {
        return res.status(400).json({ message: "No hay un código pendiente, solicita uno nuevo" });
      }

      if (existingUser.verificationCodeExpires.getTime() < Date.now()) {
        return res.status(400).json({ message: "El código ha expirado, solicita uno nuevo" });
      }

      const legacyCodeMatches = await bcryptjs.compare(String(code), existingUser.verificationCode);
      if (!legacyCodeMatches) {
        return res.status(400).json({ message: "Código inválido" });
      }

      existingUser.isVerified = true;
      existingUser.verificationCode = null;
      existingUser.verificationCodeExpires = null;
      await existingUser.save();

      return res.json({ message: "Cuenta verificada con éxito" });
    }

    if (pendingRegistration.expiresAt.getTime() < Date.now()) {
      await pendingRegistration.deleteOne();
      return res.status(400).json({ message: "El registro expiró. Regístrate nuevamente." });
    }

    if (!pendingRegistration.verificationCodeExpires
      || pendingRegistration.verificationCodeExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "El código ha expirado, solicita uno nuevo" });
    }

    const isMatch = await bcryptjs.compare(String(code), pendingRegistration.verificationCode);
    if (!isMatch) {
      return res.status(400).json({ message: "Código inválido" });
    }

    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (existingUser.isVerified) {
        await pendingRegistration.deleteOne();
        return res.status(200).json({ message: "La cuenta ya estaba verificada" });
      }
      return res.status(400).json({ message: "Ya existe un registro pendiente para este correo" });
    }

    const newUser = new userModel({
      name: pendingRegistration.name,
      lastName: pendingRegistration.lastName,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
      image: pendingRegistration.image,
      public_id: pendingRegistration.public_id,
      isVerified: true,
    });
    await newUser.save();
    await pendingRegistration.deleteOne();

    return res.json({ message: "Cuenta verificada con éxito" });
  } catch (error) {
    console.error("Verification error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reenvía el código tanto a registros temporales como a cuentas heredadas sin verificar.
registerUserController.resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "El correo es requerido" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const pendingRegistration = await pendingRegistrationModel.findOne({ email: normalizedEmail });

    const genericResponse = {
      message: "Si el correo tiene un registro pendiente, se envió un nuevo código",
    };

    if (pendingRegistration) {
      await issueVerificationCode(pendingRegistration, true);
      return res.status(200).json(genericResponse);
    }

    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (!existingUser || existingUser.isVerified) {
      return res.status(200).json(genericResponse);
    }

    await issueVerificationCode(existingUser);

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Error resending code: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerUserController;
