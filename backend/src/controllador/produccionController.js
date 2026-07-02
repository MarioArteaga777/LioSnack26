import produccionModel from "../models/produccion.js";

const produccionController = {};


produccionController.getAllProduccion = async (req, res) => {
    try {
        const registros = await produccionModel.find().sort({ createdAt: -1 });
        return res.status(200).json(registros);
    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


produccionController.getUltimaProduccion = async (req, res) => {
    try {
        const ultima = await produccionModel.findOne().sort({ createdAt: -1 });

        if (!ultima) {
            return res.status(404).json({ message: "No hay registros de produccion" });
        }

        return res.status(200).json(ultima);
    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


produccionController.getProduccionById = async (req, res) => {
    try {
        const registro = await produccionModel.findById(req.params.id);

        if (!registro) {
            return res.status(404).json({ message: "Registro de produccion no encontrado" });
        }

        return res.status(200).json(registro);
    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


produccionController.insertProduccion = async (req, res) => {
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


        const newProduccion = new produccionModel({
            SKU,
            HoraInicio,
            HoraFinalizacion,
            BolsasEsperadas,
            HorasReales,
            BolsasObtenidas,
            KG,
            Observaciones,
            Estado: Estado || "En proceso"
        });


        await newProduccion.save();

        return res.status(200).json({ message: "Produccion registrada exitosamente" });

    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


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

        return res.status(200).json({ message: "Produccion actualizada exitosamente" });

    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


produccionController.deleteProduccion = async (req, res) => {
    try {
        await produccionModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Registro de produccion eliminado exitosamente" });
    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default produccionController;
