import express from "express";
import produccionController from "../controller/produccionController.js";

const router = express.Router();

router.route("/")
    .get(produccionController.getAllProduccion)
    .post(produccionController.insertProduccion);

router.route("/:id")
    .get(produccionController.getProduccionById)
    .put(produccionController.updateProduccion)
    .delete(produccionController.deleteProduccion);

export default router;
