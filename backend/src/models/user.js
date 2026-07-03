import { Schema, model } from "mongoose";


const userSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    isVerified: {type: Boolean, default: false},
    verificationCode: {type: String, default: null},
    verificationCodeExpires: {type: Date, default: null},
    loginAttempts: {type: Number, default: 0},
    timeOut: {type: Date, default: null}
},{
    timestamps: true,
    strict: false
})

export default model("usuarios", userSchema)