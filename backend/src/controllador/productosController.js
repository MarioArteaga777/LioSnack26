import productosModel from "../models/productos.js";
import upload from "../utils/cloudinaryConfig.js";

const productosController = {};

productosController.getAllProductos = async (req, res) => {
    try {
        const productos = await productosModel.find();
        return res.status(200).json(productos);
    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


productosController.getProductoById = async (req, res) => {
    try {
        const producto = await productosModel.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json(producto);
    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


productosController.insertProducto = async (req, res) => {
    try {
        const { Nombre, SKU, Precio, Estado } = req.body;

      
        const Imagen = req.file ? req.file.path : "";

        const newProducto = new productosModel({
            Nombre,
            Imagen,
            SKU,
            Precio,
            Estado: Estado || "En Stock"
        });

        await newProducto.save();

        return res.status(200).json({ message: "Producto guardado exitosamente" });

    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

productosController.updateProducto = async (req, res) => {
    try {
        const { Nombre, SKU, Precio, Estado } = req.body;

        const updatedData = { Nombre, SKU, Precio, Estado };

        if (req.file) {
            updatedData.Imagen = req.file.path;
        }

        await productosModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        return res.status(200).json({ message: "Producto actualizado exitosamente" });

    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

productosController.deleteProducto = async (req, res) => {
    try {
        await productosModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default productosController;