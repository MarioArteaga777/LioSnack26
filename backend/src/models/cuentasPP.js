import { Schema, model } from "mongoose";

const cuentasPPFormSchema = new Schema({
    fecha_factura: { type: Date },          // Fecha de Factura: (Selector de fecha)
    proveedor: { type: String },            // Proveedor: (Selector desplegable / Texto)
    concepto_material: { type: String },    // Concepto / Material: (Campo de texto amplio)
    monto_total: { type: Number },          // Monto Total: (Campo numérico)
    pagos_realizados: { type: Number },     // Pagos Realizados: (Campo numérico)
    saldo_pendiente: { type: Number },      // Saldo Pendiente: (Campo numérico)
    fecha_vencimiento: { type: Date },      // Fecha de vencimiento: (Selector de fecha)
    dias_para_vencer: { type: Number },     // Días para vencer: (Campo numérico o calculado)
    estado: { type: String },               // Estado: (Texto / Desplegable, ej: "Pendiente")
    forma_pago: { type: String },           // Forma de Pago: (Selector desplegable)
    notas: { type: String }                 // Notas: (Campo de texto amplio)
}, {
    timestamps: true,
    strict: false 
});

export default model("CuentasPP", cuentasPPFormSchema);