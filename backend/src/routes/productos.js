import express from "express";
import productosController from "../controller/productosController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router.route("/")
    .get(productosController.getAllProductos)
    .post(upload.single("Imagen"), productosController.insertProducto);

router.route("/:id")
    .get(productosController.getProductoById)
    .put(upload.single("Imagen"), productosController.updateProducto)
    .delete(productosController.deleteProducto);

export default router;