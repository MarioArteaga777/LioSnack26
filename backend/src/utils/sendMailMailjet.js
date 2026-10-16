// Envío de correos: Gmail + Mailjet como respaldo.
// Usa USER_EMAIL + USER_PASSWORD (contraseña de aplicación de 16 letras) y
// API_KEY_MAILJET + API_SECRET_MAILJET + MAILJET_FROM_EMAIL del .env.
import nodemailer from "nodemailer";
import Mailjet from "node-mailjet";
import { config } from "../config.js";

const mailjet = Mailjet.apiConnect(
  config.mailjet.apiKey,
  config.mailjet.secretKey
);

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
  // Timeout corto: en Render el SMTP de Gmail a veces se queda colgado 120s.
  // Si tarda >15s, abortamos y probamos Mailjet para no dejar el fetch colgado.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.email.user_email, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
  const fromName = (config.mailjet.fromName || "LioSnacks").trim() || "LioSnacks";
  const sendPromise = transporter.sendMail({
    from: `"${fromName}" <${config.email.user_email}>`,
    to,
    subject,
    text: stripHtml(html),
    html,
  });
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout enviando por Gmail (20s)")), 20000)
  );
  const info = await Promise.race([sendPromise, timeoutPromise]);
  console.log(`[Email][Gmail] enviado a ${to} messageId=${info.messageId}`);
  return { provider: "gmail", messageId: info.messageId };
};

const sendViaMailjet = async (to, subject, html) => {
  const fromEmail = (config.mailjet.fromEmail || "").trim();
  const fromName = (config.mailjet.fromName || "LioSnacks").trim() || "LioSnacks";
  if (!config.mailjet.apiKey || !config.mailjet.secretKey || !fromEmail) {
    throw new Error("Falta API_KEY_MAILJET / API_SECRET_MAILJET / MAILJET_FROM_EMAIL para respaldo Mailjet");
  }
  const result = await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: { Email: fromEmail, Name: fromName },
        To: [{ Email: to }],
        Subject: subject,
        TextPart: stripHtml(html),
        HTMLPart: html,
        CustomCampaign: "LioSnacks_auth",
      },
    ],
  });
  const msg = result.body?.Messages?.[0];
  console.log(`[Email][Mailjet] to=${to} status=${msg?.Status} messageId=${msg?.To?.[0]?.MessageID}`);
  return { provider: "mailjet", status: msg?.Status, messageId: msg?.To?.[0]?.MessageID };
};

/**
 * Función reutilizable para enviar correos (registro, recuperación, etc).
 * Gmail primero, Mailjet como respaldo si Gmail falla o se cuelga.
 */
export const sendEmail = async (to, subject, html) => {
  try {
    return await sendViaGmail(to, subject, html);
  } catch (gmailErr) {
    console.error("[Email][Gmail] fallo:", gmailErr.message);
    try {
      console.warn("[Email] Gmail fallo, probando Mailjet como respaldo...");
      return await sendViaMailjet(to, subject, html);
    } catch (mjErr) {
      console.error("[Email][Mailjet] respaldo tambien fallo:", mjErr.response?.body || mjErr.message);
      // Devolvemos el error real para que el controlador lo muestre
      throw new Error(`Gmail: ${gmailErr.message} | Mailjet: ${mjErr.response?.body?.ErrorMessage || mjErr.message}`);
    }
  }
};
