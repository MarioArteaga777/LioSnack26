import { Schema, model } from "mongoose";

const produccionSchema = new Schema({
    SKU: {
        type: String,
        required: true
    },
    HoraInicio: {
        type: String,
        required: true
    },
    HoraFinalizacion: {
        type: String,
        required: true
    },
    BolsasEsperadas: {
        type: Number,
        required: true
    },
    HorasReales: {
        type: Number,
        required: true
    },
    BolsasObtenidas: {
        type: Number,
        default: 0
    },
    KG: {
        type: Number,
        required: true
    },
    Observaciones: {
        type: String
    },
    Estado: {
        type: String,
        default: "En proceso"
    }
}, {
    timestamps: true
});

export default model("produccion", produccionSchema);
