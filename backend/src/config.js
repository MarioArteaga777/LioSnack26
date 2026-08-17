import dotenv from "dotenv";
import { fileURLToPath } from "url";

const envPath = fileURLToPath(new URL("../.env", import.meta.url));

dotenv.config({ path: envPath });

export const config = {
  db: {
    URI: process.env.DB_URI,
  },
  server: {
    port: process.env.PORT || 4000,
  },
  JWT: {
    secret: process.env.JWT_SECRET_KEY,
  },
  email: {
    user_email: process.env.USER_EMAIL,
    user_password: process.env.USER_PASSWORD,
  },
  cloudinary: {
    cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  wompi: {
    grant_type: process.env.GRANT_TYPE,
    audience: process.env.AUDIENCE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  },
  mailjet: {
    apiKey: process.env.API_KEY_MAILJET,
    secretKey: process.env.API_SECRET_MAILJET,
    fromEmail: process.env.MAILJET_FROM_EMAIL,
    fromName: process.env.MAILJET_FROM_NAME,
  },
};
