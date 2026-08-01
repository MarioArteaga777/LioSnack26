import clientModel from "../models/clients.js";
import { v2 as cloudinary } from "cloudinary";

const clientsController = {};

const parseClientPayload = (body) => ({
    name: body.name?.trim(),
    type: body.type,
    address: body.address?.trim(),
    phone: body.phone?.trim(),
    email: body.email?.trim().toLowerCase(),
});

const validateClientPayload = (payload) => {
    if (!payload.name) return "El nombre es requerido";
    if (!["empresa", "persona"].includes(payload.type)) {
        return "El tipo de cliente debe ser 'empresa' o 'persona'";
    }

    return null;
};

const getErrorStatus = (error) => {
    if (error.name === "ValidationError" || error.name === "CastError") return 400;
    return 500;
};

// Devuelve todos los clientes registrados
clientsController.getAllClients = async (req, res) => {
    try {
        const clients = await clientModel.find().sort({ createdAt: -1 });
        return res.status(200).json(clients);
    } catch (error) {
        console.error("Error getting clients:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Busca un cliente por su ID
clientsController.getClientById = async (req, res) => {
    try {
        const client = await clientModel.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        return res.status(200).json(client);
    } catch (error) {
        console.error("Error getting client:", error);
        return res.status(getErrorStatus(error)).json({ message: error.message || "Internal server error" });
    }
};

// Crea un nuevo cliente
clientsController.createClient = async (req, res) => {
    try {
        const payload = parseClientPayload(req.body);
        const validationError = validateClientPayload(payload);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const newClient = new clientModel(payload);

        if (req.file) {
            newClient.image = req.file.path;
            newClient.public_id = req.file.filename;
        }

        const savedClient = await newClient.save();

        return res.status(201).json({
            message: "Cliente creado exitosamente",
            client: savedClient,
        });
    } catch (error) {
        console.error("Error creating client:", error);
        return res.status(getErrorStatus(error)).json({ message: error.message || "Internal server error" });
    }
};

// Actualiza un cliente existente
clientsController.updateClient = async (req, res) => {
    try {
        const payload = parseClientPayload(req.body);
        const validationError = validateClientPayload(payload);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const existingClient = await clientModel.findById(req.params.id);

        if (!existingClient) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        if (req.file) {
            if (existingClient.public_id) {
                await cloudinary.uploader.destroy(existingClient.public_id);
            }
            payload.image = req.file.path;
            payload.public_id = req.file.filename;
        }

        const updatedClient = await clientModel.findByIdAndUpdate(
            req.params.id,
            payload,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Cliente actualizado exitosamente",
            client: updatedClient,
        });
    } catch (error) {
        console.error("Error updating client:", error);
        return res.status(getErrorStatus(error)).json({ message: error.message || "Internal server error" });
    }
};

// Elimina un cliente por su ID
clientsController.deleteClient = async (req, res) => {
    try {
        const deletedClient = await clientModel.findByIdAndDelete(req.params.id);

        if (!deletedClient) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        if (deletedClient.public_id) {
            await cloudinary.uploader.destroy(deletedClient.public_id);
        }

        return res.status(200).json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
        console.error("Error deleting client:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default clientsController;
