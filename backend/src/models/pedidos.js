import { Schema, model } from "mongoose";

const pedidoSchema = new Schema({
    fecha_pedido: { type: Date },
    cliente: { type: String },
    punto_de_venta: { type: String },
    vendedor_asignado: { type: String },
    items: [
        {
            sku: { type: String },
            producto: { type: String },
            cantidad_solicitada: { type: Number },
            precio_unitario: { type: Number }
        }
    ],
    total_pedido: { type: Number },
    estado_pedido: { type: String },
    observaciones: { type: String }
}, {
    timestamps: true,
    strict: false
});

export default model("pedido", pedidoSchema);