import express from "express";
import cuentasPPController from "../controller/cuentasPPController.js";

const router = express.Router();

router.route("/")
  .get(cuentasPPController.getAllCuentasPP);

router.route("/insert")
  .post(cuentasPPController.insertCuentaPP);

router.route("/:id")
  .put(cuentasPPController.updateCuentaPP)
  .delete(cuentasPPController.deleteCuentaPP);

export default router;