import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";
import userModel from "../models/user.js";

export default async function customerAuth(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : req.cookies?.authCookie;

  if (!token) {
    return res.status(401).json({ message: "Inicia sesión para ver tus pedidos" });
  }

  let decoded;
  try {
    decoded = jsonwebtoken.verify(token, config.JWT.secret);
  } catch {
    return res.status(401).json({ message: "Tu sesión expiró. Inicia sesión nuevamente" });
  }

  if (!decoded.id) {
    return res.status(401).json({ message: "Sesión de cliente inválida" });
  }

  try {
    const user = await userModel
      .findById(decoded.id)
      .select("_id name lastName email isVerified");

    if (!user?.isVerified) {
      return res.status(401).json({ message: "La cuenta no está verificada" });
    }

    req.customer = user;
    return next();
  } catch (error) {
    console.error("Customer authentication error:", error.message);
    return res.status(500).json({ message: "No se pudo validar la sesión" });
  }
}