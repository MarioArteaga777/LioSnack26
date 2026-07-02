import express from "express";
import produccionController from "../controllador/produccionController.js";

const router = express.Router();

router.route("/")
    .get(produccionController.getAllProduccion)

router.route("/ultima")
    .get(produccionController.getUltimaProduccion)

router.route("/insert")
    .post(produccionController.insertProduccion)

router.route("/:id")
    .get(produccionController.getProduccionById)
    .put(produccionController.updateProduccion)
    .delete(produccionController.deleteProduccion)

export default router;
