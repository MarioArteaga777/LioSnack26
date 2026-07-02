import { Schema, model } from "mongoose";


const userSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {type: String},
    isVerified: {type: Boolean},
    loginAttempts: {type: Number},
    timeOut: {type: Date}
},{
    timestamps: true,
    strict: false
})

export default model("Users", userSchema)