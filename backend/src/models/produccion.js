import { Schema, model } from "mongoose";

const produccionSchema = new Schema({
    SKU:               { type: String },
    HoraInicio:        { type: String },
    HoraFinalizacion:  { type: String },
    BolsasEsperadas:   { type: Number },
    HorasReales:       { type: Number },
    BolsasObtenidas:   { type: Number },
    KG:                { type: Number },
    Observaciones:     { type: String },
    Estado:            { type: String }   // "En proceso" / "Finalizado"
}, {
    timestamps: true,
    strict: false
});

export default model("produccion", produccionSchema);
