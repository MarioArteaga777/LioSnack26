import express from "express";
import clientsController from "../controller/clientsController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router
  .route("/")
  .get(clientsController.getAllClients)
  .post(upload.single("image"), clientsController.createClient);

router
  .route("/:id")
  .get(clientsController.getClientById)
  .put(upload.single("image"), clientsController.updateClient)
  .delete(clientsController.deleteClient);

export default router;
