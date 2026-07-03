import { Schema, model } from "mongoose";

const productosSchema = new Schema({
    Nombre: {
        type: String,
        required: true
    },
    Imagen: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    SKU: {
        type: String,
        required: true
    },
    Precio: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export default model("productos", productosSchema);