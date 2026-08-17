import { Schema, model } from "mongoose";

const clientSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["empresa", "persona"], required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    image: { type: String, default: null },
    public_id: { type: String, default: null },
}, {
    timestamps: true,
});

export default model("Clients", clientSchema);
