import express from "express";
import pedidoController from "../controller/pedidosController.js";
import customerAuth from "../middlewares/customerAuth.js";

const router = express.Router();

router.route("/mis-pedidos")
  .get(customerAuth, pedidoController.getMyOrders)
  .post(customerAuth, pedidoController.createMyOrder);

router.route("/")
  .get(pedidoController.getAllPedidos);

router.route("/insert")
  .post(pedidoController.insertPedido);

router.route("/:id")
  .put(pedidoController.updatePedido)
  .delete(pedidoController.deletePedido);

export default router;