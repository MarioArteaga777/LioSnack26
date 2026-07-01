import { Schema, model } from "mongoose";

const cuentasPCFormSchema = new Schema({
    fecha_factura: { type: Date },          // Fecha de Factura: (Selector de fecha)
    cliente: { type: String },              // Cliente: (Selector desplegable)
    sku_descripcion: { type: String },      // SKU / Descripción: (Campo de texto amplio)
    fecha_vencimiento: { type: Date },      // Fecha de vencimiento: (Selector de fecha)
    monto_facturado: { type: Number },      // Monto Facturado: (Campo numérico)
    abono: { type: Number },                // Abono: (Campo numérico)
    forma_cobro: { type: String },          // Forma Cobro: (Selector desplegable)
    notas: { type: String }                 // Notas: (Campo de texto amplio)
}, {
    timestamps: true,
    strict: false 
});

export default model("CuentasPC", cuentasPCFormSchema);