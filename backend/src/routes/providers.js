import express from "express";
import providersController from "../controller/providersController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router
  .route("/")
  .get(providersController.getAllProviders)
  .post(upload.single("image"), providersController.createProvider);

router
  .route("/:id")
  .get(providersController.getProviderById)
  .put(upload.single("image"), providersController.updateProvider)
  .delete(providersController.deleteProvider);

export default router;
