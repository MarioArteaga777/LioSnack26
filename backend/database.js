import mongoose from "mongoose"
import { config } from "./src/config.js";

if (!config.db.URI) {
    console.error("DB_URI is not configured");
} else {
    mongoose.connect(config.db.URI).catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });
}

//Comprobar que todo funciona
const connection = mongoose.connection;

connection.once("open", ()=>{
    console.log("DB is connected")
})
connection.on("disconnected", ()=>{
    console.log("DB is disconnected")
})

connection.on("error", (error)=>{
    console.log("error found" + error)
})
