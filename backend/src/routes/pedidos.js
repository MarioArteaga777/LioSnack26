import express from "express";
import pedidoController from "../controller/pedidoController.js";

const router = express.Router();

router.route("/")
  .get(pedidoController.getAllPedidos);

router.route("/insert")
  .post(pedidoController.insertPedido);

router.route("/:id")
  .put(pedidoController.updatePedido)
  .delete(pedidoController.deletePedido);

export default router;