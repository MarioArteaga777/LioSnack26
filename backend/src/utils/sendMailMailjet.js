// Utilidad de envío de correos: Mailjet como principal + Gmail como respaldo.
// Si Mailjet falla, se usa Gmail automáticamente para no dejar sin código.
import Mailjet from "node-mailjet";
import nodemailer from "nodemailer";
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
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.email.user_email, pass },
  });
  const info = await transporter.sendMail({
    from: `"${config.mailjet.fromName || "LioSnacks"}" <${config.email.user_email}>`,
    to,
    subject,
    text: stripHtml(html),
    html,
  });
  console.log(`[Email][Gmail] enviado a ${to} messageId=${info.messageId}`);
  return { provider: "gmail", messageId: info.messageId };
};

const sendViaMailjet = async (to, subject, html, fromEmail, fromName) => {
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
  const status = msg?.Status;
  const messageId = msg?.To?.[0]?.MessageID;
  console.log(`[Email][Mailjet] to=${to} status=${status} messageId=${messageId}`);
  return { provider: "mailjet", status, messageId, body: result.body };
};

export const sendEmail = async (to, subject, html) => {
  const fromEmail = (config.mailjet.fromEmail || "").trim();
  const fromName = (config.mailjet.fromName || "LioSnacks").trim();

  // 1) Mailjet primero (tu flujo original)
  if (fromEmail) {
    try {
      return await sendViaMailjet(to, subject, html, fromEmail, fromName);
    } catch (mjErr) {
      console.error("[Email][Mailjet] fallo:", mjErr.response?.body || mjErr.message);
      // 2) Respaldo Gmail para no dejar al usuario sin código
      try {
        console.warn("[Email] Mailjet fallo, probando Gmail como respaldo...");
        return await sendViaGmail(to, subject, html);
      } catch (gmailErr) {
        console.error("[Email][Gmail] respaldo tambien fallo:", gmailErr.message);
        throw mjErr; // devolvemos el error original de Mailjet
      }
    }
  }

  // Sin remitente Mailjet configurado, directo a Gmail
  return await sendViaGmail(to, subject, html);
};
