import { Schema, model } from "mongoose";

const pendingRegistrationSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: null },
    public_id: { type: String, default: null },
    verificationCode: { type: String, required: true },
    verificationCodeExpires: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

export default model("pendingRegistrations", pendingRegistrationSchema);