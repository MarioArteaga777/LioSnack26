import providerModel from "../models/providers.js";
import { v2 as cloudinary } from "cloudinary";

const providersController = {};

const parseProviderPayload = (body) => ({
  name: body.name?.trim(),
  type: body.type,
  address: body.address?.trim(),
  phone: body.phone?.trim(),
  email: body.email?.trim().toLowerCase(),
});

const validateProviderPayload = (payload) => {
  if (!payload.name) return "El nombre es requerido";
  if (!["empresa", "persona"].includes(payload.type)) {
    return "El tipo de proveedor debe ser 'empresa' o 'persona'";
  }
  return null;
};

const getErrorStatus = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") return 400;
  return 500;
};

// Devuelve todos los proveedores, con soporte de búsqueda ?search=
providersController.getAllProviders = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const providers = await providerModel.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(providers);
  } catch (error) {
    console.error("Error getting providers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Busca un proveedor por su ID
providersController.getProviderById = async (req, res) => {
  try {
    const provider = await providerModel.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    return res.status(200).json(provider);
  } catch (error) {
    console.error("Error getting provider:", error);
    return res
      .status(getErrorStatus(error))
      .json({ message: error.message || "Internal server error" });
  }
};

// Crea un nuevo proveedor
providersController.createProvider = async (req, res) => {
  try {
    const payload = parseProviderPayload(req.body);
    const validationError = validateProviderPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newProvider = new providerModel(payload);

    if (req.file) {
      newProvider.image = req.file.path;
      newProvider.public_id = req.file.filename;
    }

    const savedProvider = await newProvider.save();

    return res.status(201).json({
      message: "Proveedor creado exitosamente",
      provider: savedProvider,
    });
  } catch (error) {
    console.error("Error creating provider:", error);
    return res
      .status(getErrorStatus(error))
      .json({ message: error.message || "Internal server error" });
  }
};

// Actualiza un proveedor existente
providersController.updateProvider = async (req, res) => {
  try {
    const payload = parseProviderPayload(req.body);
    const validationError = validateProviderPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingProvider = await providerModel.findById(req.params.id);

    if (!existingProvider) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    if (req.file) {
      if (existingProvider.public_id) {
        await cloudinary.uploader.destroy(existingProvider.public_id);
      }
      payload.image = req.file.path;
      payload.public_id = req.file.filename;
    }

    const updatedProvider = await providerModel.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Proveedor actualizado exitosamente",
      provider: updatedProvider,
    });
  } catch (error) {
    console.error("Error updating provider:", error);
    return res
      .status(getErrorStatus(error))
      .json({ message: error.message || "Internal server error" });
  }
};

// Elimina un proveedor por su ID
providersController.deleteProvider = async (req, res) => {
  try {
    const deletedProvider = await providerModel.findByIdAndDelete(req.params.id);

    if (!deletedProvider) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    if (deletedProvider.public_id) {
      await cloudinary.uploader.destroy(deletedProvider.public_id);
    }

    return res
      .status(200)
      .json({ message: "Proveedor eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting provider:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default providersController;
