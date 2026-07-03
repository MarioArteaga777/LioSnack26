import express from "express";
import CuentasPCRoutes from "./src/routes/cuentasPC.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import CuentasPPRoutes from "./src/routes/cuentasPP.js"
import productosRoutes from "./src/routes/productos.js";
import produccionRoutes from "./src/routes/produccion.js";
import loginRoutes from "./src/routes/loginUser.js"
import userRoutes from "./src/routes/user.js"
import registerUserRoutes from "./src/routes/registerUser.js"
import pedidosRoutes from "./src/routes/pedidos.js"


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

app.use("/api/produccion", produccionRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/CuentasPorCobrar", CuentasPCRoutes);
app.use("/api/cuentasPorPagar", CuentasPPRoutes);
app.use("/api/login", loginRoutes)
app.use("/api/usuarios", userRoutes)
app.use("/api/register", registerUserRoutes)
app.use("/api/pedidos", pedidosRoutes)

export default app;