import produccionModel from "../models/produccion.js";

const produccionController = {};

// Obtener todos
produccionController.getAllProduccion = async (req, res) => {
    try {
        const registros = await produccionModel.find();
        return res.status(200).json(registros);
    } catch (error) {
        console.log("error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Obtener por ID
produccionController.getProduccionById = async (req, res) => {
    try {
        const registro = await produccionModel.findById(req.params.id);

        if (!registro) {
            return res.status(404).json({ message: "Registro de produccion no encontrado" });
        }

        return res.status(200).json(registro);
    } catch (error) {
        console.log("error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Insertar
produccionController.insertProduccion = async (req, res) => {
    try {
        const {
            SKU,
            HoraInicio,
            HoraFinalizacion,
            BolsasEsperadas,
            HorasReales,
            KG,
            Observaciones,
            Estado
        } = req.body;

        const newProduccion = new produccionModel({
            SKU,
            HoraInicio,
            HoraFinalizacion,
            BolsasEsperadas,
            HorasReales,
            BolsasObtenidas: 0,
            KG,
            Observaciones,
            Estado: Estado || "En proceso"
        });

        await newProduccion.save();

        return res.status(200).json({
            message: "Produccion registrada exitosamente"
        });
    } catch (error) {
        console.log("error:", error.message);
        return res.status(500).json({
            message: "Error al guardar la produccion",
            error: error.message
        });
    }
};

// Actualizar
produccionController.updateProduccion = async (req, res) => {
    try {
        const {
            SKU,
            HoraInicio,
            HoraFinalizacion,
            BolsasEsperadas,
            HorasReales,
            BolsasObtenidas,
            KG,
            Observaciones,
            Estado
        } = req.body;

        const updatedData = {
            SKU,
            HoraInicio,
            HoraFinalizacion,
            BolsasEsperadas,
            HorasReales,
            BolsasObtenidas,
            KG,
            Observaciones,
            Estado
        };

        await produccionModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        return res.status(200).json({
            message: "Produccion actualizada exitosamente"
        });
    } catch (error) {
        console.log("error:", error.message);
        return res.status(500).json({
            message: "Error al actualizar la produccion",
            error: error.message
        });
    }
};

// Eliminar
produccionController.deleteProduccion = async (req, res) => {
    try {
        await produccionModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Produccion eliminada"
        });
    } catch (error) {
        console.log("error:", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default produccionController;
