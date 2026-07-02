import { Schema, model } from "mongoose";

const productosSchema = new Schema({
    Nombre:  { type: String },
    Imagen:  { type: String },
    SKU:     { type: String },
    Precio:  { type: Number },
    Estado:  { type: String }   // "En Stock" / "Sin Stock"
}, {
    timestamps: true,
    strict: false
});

export default model("productos", productosSchema);
