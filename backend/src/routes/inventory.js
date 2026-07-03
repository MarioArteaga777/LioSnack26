import express from "express";
import inventoryController from "../controller/inventoryController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router
  .route("/")
  .get(inventoryController.getAllInventory)
  .post(upload.single("image"), inventoryController.createInventory);

router
  .route("/:id")
  .get(inventoryController.getInventoryById)
  .put(upload.single("image"), inventoryController.updateInventory)
  .delete(inventoryController.deleteInventory);

export default router;
