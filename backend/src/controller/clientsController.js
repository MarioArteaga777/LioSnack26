import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/user.js";

const clientsController = {};

// Campos internos que nunca se exponen al panel administrativo.
const CLIENT_PUBLIC_FIELDS =
    "-password -recoveryCodeHash -recoveryCodeExpires -recoveryTokenId -verificationCode -verificationCodeExpires -loginAttempts -timeOut";

const parseClientPayload = (body) => ({
    name: body.name?.trim(),
    lastName: body.lastName?.trim() || null,
    type: body.type || "persona",
    email: body.email?.trim().toLowerCase(),
    phone: body.phone?.trim(),
    address: body.address?.trim(),
});

const validateClientPayload = (payload) => {
    if (!payload.name) return "El nombre es requerido";
    if (!["empresa", "persona"].includes(payload.type)) {
        return "El tipo de cliente debe ser 'empresa' o 'persona'";
    }
    // Las empresas solo necesitan nombre; el apellido es de personas
    if (payload.type === "persona" && !payload.lastName) {
        return "El apellido es requerido";
    }
    if (!payload.email) return "El correo es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        return "El correo no es válido";
    }

    return null;
};

const getErrorStatus = (error) => {
    if (error.name === "ValidationError" || error.name === "CastError") return 400;
    return 500;
};

// Los clientes son las cuentas con rol "cliente": los registros hechos por
// los propios usuarios en LioSnacks_Web o la app móvil, más los agregados
// manualmente desde el panel administrativo.
clientsController.getAllClients = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = { role: "cliente" };

        if (typeof search === "string" && search.trim()) {
            const regex = new RegExp(
                search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i",
            );
            filter.$or = [{ name: regex }, { lastName: regex }, { email: regex }];
        }

        const clients = await userModel
            .find(filter)
            .select(CLIENT_PUBLIC_FIELDS)
            .sort({ createdAt: -1 });

        return res.status(200).json(clients);
    } catch (error) {
        console.error("Error getting clients:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Busca un cliente por su ID
clientsController.getClientById = async (req, res) => {
    try {
        const client = await userModel
            .findOne({ _id: req.params.id, role: "cliente" })
            .select(CLIENT_PUBLIC_FIELDS);

        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        return res.status(200).json(client);
    } catch (error) {
        console.error("Error getting client:", error);
        return res.status(getErrorStatus(error)).json({ message: error.message || "Internal server error" });
    }
};

// Crea un cliente manualmente desde el panel. Nace como cuenta verificada
// con contraseña aleatoria; el cliente la fija luego con "Olvidé mi contraseña".
clientsController.createClient = async (req, res) => {
    try {
        const payload = parseClientPayload(req.body);
        const validationError = validateClientPayload(payload);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const existingUser = await userModel.findOne({ email: payload.email });

        if (existingUser?.isVerified) {
            return res.status(400).json({ message: "El correo ya está en uso" });
        }

        const randomPassword = crypto.randomBytes(16).toString("hex");
        const passwordHash = await bcryptjs.hash(randomPassword, 10);

        let savedClient;

        if (existingUser) {
            // Reutiliza un registro pendiente (sin verificar) con el mismo correo.
            existingUser.name = payload.name;
            existingUser.lastName = payload.lastName;
            existingUser.password = passwordHash;
            existingUser.phone = payload.phone || null;
            existingUser.address = payload.address || null;
            existingUser.role = "cliente";
            existingUser.isVerified = true;
            existingUser.verificationCode = null;
            existingUser.verificationCodeExpires = null;
            if (req.file) {
                existingUser.image = req.file.path;
                existingUser.public_id = req.file.filename;
            }
            savedClient = await existingUser.save();
        } else {
            const newClient = new userModel({
                ...payload,
                password: passwordHash,
                role: "cliente",
                isVerified: true,
                image: req.file?.path || null,
                public_id: req.file?.filename || null,
            });
            savedClient = await newClient.save();
        }

        const { password: _password, ...safeClient } = savedClient.toObject();

        return res.status(201).json({
            message: "Cliente creado exitosamente",
            client: safeClient,
        });
    } catch (error) {
        console.error("Error creating client:", error);
        return res.status(getErrorStatus(error)).json({ message: error.message || "Internal server error" });
    }
};

// Actualiza un cliente existente (solo cuentas con rol "cliente")
clientsController.updateClient = async (req, res) => {
    try {
        const payload = parseClientPayload(req.body);
        const validationError = validateClientPayload(payload);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const existingClient = await userModel.findOne({ _id: req.params.id, role: "cliente" });

        if (!existingClient) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        if (payload.email && payload.email !== existingClient.email) {
            const emailTaken = await userModel.findOne({
                email: payload.email,
                _id: { $ne: req.params.id },
                isVerified: true,
            });

            if (emailTaken) {
                return res.status(400).json({ message: "El correo ya está en uso" });
            }
        }

        if (req.file) {
            if (existingClient.public_id) {
                await cloudinary.uploader.destroy(existingClient.public_id);
            }
            payload.image = req.file.path;
            payload.public_id = req.file.filename;
        }

        const updatedClient = await userModel.findByIdAndUpdate(
            req.params.id,
            payload,
            { new: true, runValidators: true }
        ).select(CLIENT_PUBLIC_FIELDS);

        return res.status(200).json({
            message: "Cliente actualizado exitosamente",
            client: updatedClient,
        });
    } catch (error) {
        console.error("Error updating client:", error);
        return res.status(getErrorStatus(error)).json({ message: error.message || "Internal server error" });
    }
};

// Elimina un cliente por su ID (solo cuentas con rol "cliente")
clientsController.deleteClient = async (req, res) => {
    try {
        const deletedClient = await userModel.findOneAndDelete({
            _id: req.params.id,
            role: "cliente",
        });

        if (!deletedClient) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        if (deletedClient.public_id) {
            await cloudinary.uploader.destroy(deletedClient.public_id);
        }

        return res.status(200).json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
        console.error("Error deleting client:", error);
        return res.status(getErrorStatus(error)).json({ message: error.message || "Internal server error" });
    }
};

export default clientsController;
