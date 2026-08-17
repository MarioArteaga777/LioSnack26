import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { sendEmail } from "../utils/sendMailMailjet.js";
import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";
import userModel from "../models/user.js";

const registerUserController = {};

const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;

// Genera un código, lo guarda hasheado en el usuario y lo envía por correo vía Mailjet.
const issueVerificationCode = async (user) => {
  const code = crypto.randomInt(100000, 1000000).toString();

  user.verificationCode = await bcryptjs.hash(code, 10);
  user.verificationCodeExpires = new Date(Date.now() + VERIFICATION_CODE_TTL_MS);
  await user.save();

  const htmlContent = HTMLRecoveryEmail(code);
  await sendEmail(user.email, "Verificación de cuenta", htmlContent);
};

// Registra un nuevo usuario y dispara el envío del código de verificación
registerUserController.register = async (req, res) => {
  try {
    let { name, lastName, email, password } = req.body;

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

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
      password: passwordHash,
    });

    if (req.file) {
      newUser.image = req.file.path;
      newUser.public_id = req.file.filename;
    }

    await newUser.save();

    try {
      await issueVerificationCode(newUser);
    } catch (mailError) {
      console.error("Error sending email: " + mailError);
      return res.status(201).json({
        message:
          "Usuario creado, pero no se pudo enviar el correo de verificación. Puede reenviarse más tarde.",
      });
    }

    return res.status(201).json({
      message: "Usuario creado. Se envió un código de verificación al correo.",
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

    const normalizedEmail = email.toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "La cuenta ya estaba verificada" });
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return res.status(400).json({ message: "No hay un código pendiente, solicita uno nuevo" });
    }

    if (user.verificationCodeExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "El código ha expirado, solicita uno nuevo" });
    }

    const isMatch = await bcryptjs.compare(String(code), user.verificationCode);
    if (!isMatch) {
      return res.status(400).json({ message: "Código inválido" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    return res.json({ message: "Cuenta verificada con éxito" });
  } catch (error) {
    console.error("Verification error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reenvía un nuevo código de verificación si la cuenta aún no fue verificada
registerUserController.resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El correo es requerido" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await userModel.findOne({ email: normalizedEmail });

    const genericResponse = {
      message: "Si el correo existe y no ha sido verificado, se envió un nuevo código",
    };

    if (!user || user.isVerified) {
      return res.status(200).json(genericResponse);
    }

    await issueVerificationCode(user);

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Error resending code: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerUserController;