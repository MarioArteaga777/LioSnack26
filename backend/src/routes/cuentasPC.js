import express from "express";
import CuentasPCController from "../controller/cuentasPCController.js"


const router = express.Router()

router.route("/")
.get(CuentasPCController.getAllCuentasPC)

router.route("/insert")
.post(CuentasPCController.insertCuentaPC)

router.route("/:id")
.put(CuentasPCController.updateCuentaPC)
.delete(CuentasPCController.deleteCuentaPC)

export default router