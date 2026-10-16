// Envío de correos con Gmail (cuenta empresa / actual).
// Usa USER_EMAIL + USER_PASSWORD (contraseña de aplicación de 16 letras) del .env.
import nodemailer from "nodemailer";
import { config } from "../config.js";

const stripHtml = (html = "") =>
  html
    .replace(/<style[^>]*>.*?<\/style>/gis, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sendViaGmail = async (to, subject, html) => {
  // Las contraseñas de aplicación de Gmail van sin espacios
  const pass = (config.email.user_password || "").replace(/\s/g, "");
  if (!config.email.user_email || !pass) {
    throw new Error("Falta USER_EMAIL / USER_PASSWORD en el .env para envío Gmail");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.email.user_email, pass },
  });
  const fromName = (config.mailjet.fromName || "LioSnacks").trim() || "LioSnacks";
  const info = await transporter.sendMail({
    from: `"${fromName}" <${config.email.user_email}>`,
    to,
    subject,
    text: stripHtml(html),
    html,
  });
  console.log(`[Email][Gmail] enviado a ${to} messageId=${info.messageId}`);
  return { provider: "gmail", messageId: info.messageId };
};

/**
 * Función reutilizable para enviar correos (registro, recuperación, etc).
 * Ahora solo Gmail para no depender de Mailjet.
 */
export const sendEmail = async (to, subject, html) => {
  try {
    return await sendViaGmail(to, subject, html);
  } catch (err) {
    console.error("[Email][Gmail] fallo:", err.message);
    throw err;
  }
};
