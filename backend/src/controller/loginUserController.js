import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import userModel from "../models/user.js"; 
import { config } from "../config.js";

const loginUserController = {};

// Autentica al usuario y, si es válido, entrega la cookie con el token JWT
loginUserController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await userModel.findOne({ email: email.toLowerCase() });

    if (!userFound) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    if (!userFound.isVerified) {
      return res.status(403).json({ message: "Debes verificar tu correo antes de iniciar sesión" });
    }

    // Bloqueo temporal activo por intentos fallidos previos
    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      const remainingTime = Math.ceil((userFound.timeOut - Date.now()) / 60000);
      return res.status(403).json({
        message: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${remainingTime} minutos.`
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      // A partir del quinto intento fallido, se bloquea la cuenta por 15 minutos
      if (userFound.loginAttempts >= 5) {
        userFound.timeOut = Date.now() + 15 * 60 * 1000;
        userFound.loginAttempts = 0;

        await userFound.save();
        return res.status(403).json({ message: "Cuenta bloqueada por demasiados intentos fallidos" });
      }

      await userFound.save();
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Login correcto: se reinician los contadores de intentos y bloqueo
    userFound.loginAttempts = 0;
    userFound.timeOut = null;
    await userFound.save();

    const token = jsonwebtoken.sign(
      { id: userFound._id, Type: "Admin" },
      config.JWT.secret,
      { expiresIn: "30d" }
    );

    res.cookie("authCookie", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.status(200).json({
      message: "Login exitoso",
      user: {
        id: userFound._id,
        name: userFound.name,
        lastName: userFound.lastName,
        email: userFound.email,
        isVerified: userFound.isVerified
      }
    });

  } catch (error) {
    console.error("Login error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginUserController;