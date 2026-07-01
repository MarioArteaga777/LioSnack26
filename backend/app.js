import express from "express";
import CuentasPCRoutes from "./src/routes/cuentasPC.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import CuentasPPRoutes from "./src/routes/cuentasPP.js"


const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    // permitir el envio de cookies y credenciales
    credentials: true,
  }),
);

app.use(cookieParser());

//Que acepte JSON desde postman
app.use(express.json());

app.use("/api/CuentasPorCobrar", CuentasPCRoutes);
app.use("/api/cuentasPorPagar", CuentasPPRoutes);

export default app;