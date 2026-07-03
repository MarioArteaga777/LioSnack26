import { Schema, model } from "mongoose";

const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    expirationDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Inventory", inventorySchema);