import { Schema, model } from "mongoose";


const userSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    // "cliente": cuenta creada desde LioSnacks_Web o la app móvil.
    // "admin": cuenta administrativa gestionada desde LioAdmin.
    // Los documentos antiguos sin este campo se tratan como clientes.
    role: {type: String, enum: ["cliente", "admin"], default: "cliente"},
    // Tipo de cliente (solo relevante para cuentas con rol "cliente")
    type: {type: String, enum: ["empresa", "persona"], default: "persona"},
    phone: {type: String, default: null},
    address: {type: String, default: null},
    image: {type: String, default: null},
    public_id: {type: String, default: null},
    isVerified: {type: Boolean, default: false},
    verificationCode: {type: String, default: null},
    verificationCodeExpires: {type: Date, default: null},
    recoveryCodeHash: {type: String, default: null},
    recoveryCodeExpires: {type: Date, default: null},
    recoveryTokenId: {type: String, default: null},
    loginAttempts: {type: Number, default: 0},
    timeOut: {type: Date, default: null}
},{
    timestamps: true,
    strict: false
})

export default model("usuarios", userSchema)