import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import CuentasPPRoutes from "./src/routes/cuentasPP.js"
import productosRoutes from "./src/routes/productos.js";
import produccionRoutes from "./src/routes/produccion.js";
import loginRoutes from "./src/routes/loginUser.js"
import userRoutes from "./src/routes/user.js"
import registerUserRoutes from "./src/routes/registerUser.js"
import pedidosRoutes from "./src/routes/pedidos.js"
import CuentasPCRoutes from "./src/routes/cuentasPC.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js";
import clientsRoutes from "./src/routes/clients.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://lio-snacks-admin.vercel.app"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/api/produccion", produccionRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/CuentasPorCobrar", CuentasPCRoutes);
app.use("/api/cuentasPorPagar", CuentasPPRoutes);
app.use("/api/login", loginRoutes)
app.use("/api/usuarios", userRoutes)
app.use("/api/register", registerUserRoutes)
app.use("/api/pedidos", pedidosRoutes)
app.use("/api/recovery-password", recoveryPasswordRoutes)
app.use("/api/clientes", clientsRoutes)

app.use("/api/cuentasPorCobrar", CuentasPCRoutes);
app.use("/api/cuentasPorPagar", CuentasPPRoutes);

app.use("/api/login", loginRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/register", registerUserRoutes);

// 404 handler (IMPORTANTE)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error("Unhandled API error:", error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || error.status || 500;

  return res.status(statusCode).json({
    message: error.message || "Internal server error",
  });
});

export default app;
