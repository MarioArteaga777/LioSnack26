import { Schema, model } from "mongoose";

const providerSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["empresa", "persona"], default: "empresa" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    image: { type: String, default: null },
    public_id: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export default model("Proveedores", providerSchema);