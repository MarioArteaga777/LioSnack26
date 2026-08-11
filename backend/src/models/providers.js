import { Schema, model } from "mongoose";


const providerSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    image: {type: String, default: null},
    public_id: {type: String, default: null},
    isVerified: {type: Boolean, default: false},
    verificationCode: {type: String, default: null},
    verificationCodeExpires: {type: Date, default: null},
    loginAttempts: {type: Number, default: 0},
    timeOut: {type: Date, default: null}
},{
    timestamps: true,
    strict: false
})

export default model("Proveedores", userSchema)