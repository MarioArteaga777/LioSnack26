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

// Utilidad de envío: elige el proveedor según el remitente.
// - Si From es @gmail.com / @yahoo / @outlook (dominio gratuito),
//   Mailjet devuelve "success" pero Gmail lo descarta por DMARC p=reject.
//   Por eso se usa Gmail (nodemailer) directo: ese SÍ entrega.
// - Si From es dominio propio validado en Mailjet, se usa Mailjet primero.
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
  console.log(`[Email][Mailjet] to=${to} status=${status} messageId=${messageId} from=${fromEmail}`);
  return { provider: "mailjet", status, messageId, body: result.body };
};

export const sendEmail = async (to, subject, html) => {
  const fromEmail = (config.mailjet.fromEmail || "").trim();
  const fromName = (config.mailjet.fromName || "LioSnacks").trim();
  const fromDomain = (fromEmail.split("@")[1] || "").toLowerCase();

  // Dominios gratuitos que Mailjet NO puede entregar por DMARC p=reject.
  // Con estos, Mailjet responde "success"/"sent" pero Gmail lo tira en silencio
  // (ni a spam). Por eso hay que mandar por Gmail directo.
  const FREE_DOMAINS = [
    "gmail.com", "googlemail.com",
    "yahoo.com", "yahoo.es", "yahoo.com.mx",
    "outlook.com", "hotmail.com", "live.com", "hotmail.es",
    "icloud.com", "aol.com",
  ];
  const isFreeDomain = FREE_DOMAINS.includes(fromDomain);

  // CASO 1: remitente gratuito (@gmail.com) -> Gmail primero, SIEMPRE.
  // Es tu caso actual: MAILJET_FROM_EMAIL=alvarengabenjamin42@gmail.com
  if (!fromEmail || isFreeDomain) {
    if (isFreeDomain) {
      console.log(`[Email] From ${fromEmail} es dominio gratuito -> usando Gmail directo (Mailjet no entrega estos).`);
    }
    try {
      return await sendViaGmail(to, subject, html);
    } catch (gmailErr) {
      console.error("[Email][Gmail] fallo:", gmailErr.message);
      if (!fromEmail) throw gmailErr;
      // Último intento por Mailjet aunque casi seguro no entregue
      try {
        console.warn("[Email] Gmail fallo, probando Mailjet como respaldo...");
        return await sendViaMailjet(to, subject, html, fromEmail, fromName);
      } catch (mjErr) {
        console.error("[Email][Mailjet] respaldo tambien fallo:", mjErr.response?.body || mjErr.message);
        throw gmailErr;
      }
    }
  }

  // CASO 2: dominio propio validado en Mailjet -> Mailjet primero (tu flujo original)
  try {
    return await sendViaMailjet(to, subject, html, fromEmail, fromName);
  } catch (mjErr) {
    console.error("[Email][Mailjet] fallo:", mjErr.response?.body || mjErr.message);
    try {
      console.warn("[Email] Mailjet fallo, probando Gmail como respaldo...");
      return await sendViaGmail(to, subject, html);
    } catch (gmailErr) {
      console.error("[Email][Gmail] respaldo tambien fallo:", gmailErr.message);
      throw mjErr;
    }
  }
};
