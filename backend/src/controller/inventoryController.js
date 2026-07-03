import inventoryModel from "../models/inventory.js";
import { v2 as cloudinary } from "cloudinary";

const inventoryController = {};

const parseInventoryPayload = (body) => {
  const stock = Number(body.stock);
  const expirationDate = new Date(body.expirationDate);

  return {
    name: body.name?.trim(),
    sku: body.sku?.trim(),
    stock,
    location: body.location?.trim(),
    expirationDate,
  };
};

const validateInventoryPayload = (payload) => {
  if (!payload.name) return "Name is required";
  if (!payload.sku) return "SKU is required";
  if (!Number.isFinite(payload.stock) || payload.stock < 0) {
    return "Stock must be a valid number greater than or equal to 0";
  }
  if (!payload.location) return "Location is required";
  if (Number.isNaN(payload.expirationDate.getTime())) {
    return "Expiration date is required";
  }

  return null;
};

const getErrorStatus = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") return 400;
  if (error.code === 11000) return 409;
  return 500;
};

const getErrorMessage = (error) => {
  if (error.code === 11000) return "SKU already exists";
  return error.message || "Internal server error";
};

// GET ALL
inventoryController.getAllInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.find().sort({ createdAt: -1 });
    return res.status(200).json(inventory);
  } catch (error) {
    console.error("Error getting inventory:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET BY ID
inventoryController.getInventoryById = async (req, res) => {
  try {
    const item = await inventoryModel.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error("Error getting inventory item:", error);
    return res.status(getErrorStatus(error)).json({
      message: getErrorMessage(error),
    });
  }
};

// CREATE
inventoryController.createInventory = async (req, res) => {
  try {
    console.log("Inventory create body:", req.body);
    console.log("Inventory create file:", req.file);

    const payload = parseInventoryPayload(req.body);
    const validationError = validateInventoryPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const newItem = new inventoryModel({
      ...payload,
      image: req.file.path,
      public_id: req.file.filename,
    });

    const savedItem = await newItem.save();

    return res.status(201).json({
      message: "Inventory created successfully",
      inventory: savedItem,
    });
  } catch (error) {
    console.error("Error creating inventory:", error);
    return res.status(getErrorStatus(error)).json({
      message: getErrorMessage(error),
    });
  }
};

// UPDATE
inventoryController.updateInventory = async (req, res) => {
  try {
    console.log("Inventory update body:", req.body);
    console.log("Inventory update file:", req.file);

    const payload = parseInventoryPayload(req.body);
    const validationError = validateInventoryPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const item = await inventoryModel.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    const updatedData = {
      ...payload,
    };

    if (req.file) {
      if (item.public_id) {
        await cloudinary.uploader.destroy(item.public_id);
      }

      updatedData.image = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    const updatedItem = await inventoryModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Inventory updated successfully",
      inventory: updatedItem,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(getErrorStatus(error)).json({
      message: getErrorMessage(error),
    });
  }
};

// DELETE
inventoryController.deleteInventory = async (req, res) => {
  try {
    const item = await inventoryModel.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id);
    }

    await inventoryModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Inventory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return res.status(getErrorStatus(error)).json({
      message: getErrorMessage(error),
    });
  }
};

export default inventoryController;
