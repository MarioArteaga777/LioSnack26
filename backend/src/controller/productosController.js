import productosModel from "../models/productos.js";
import { v2 as cloudinary } from "cloudinary";

const productosController = {};

// Obtener todos
productosController.getAllProductos = async (req, res) => {
    try {
        const productos = await productosModel.find();
        return res.status(200).json(productos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Obtener por ID
productosController.getProductoById = async (req, res) => {
    try {
        const producto = await productosModel.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        return res.status(200).json(producto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Insertar
productosController.insertProducto = async (req, res) => {
    try {

        console.log(req.file);
        const { Nombre, SKU, Precio } = req.body;

        const newProducto = new productosModel({
            Nombre,
            Imagen: req.file.path,
            public_id: req.file.filename,
            SKU,
            Precio
        });

        await newProducto.save();

        return res.status(200).json({
            message: "Producto guardado"
        });

    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Actualizar
productosController.updateProducto = async (req, res) => {
    try {

        const { Nombre, SKU, Precio } = req.body;

        const productoEncontrado = await productosModel.findById(req.params.id);

        const updatedData = {
            Nombre,
            SKU,
            Precio
        };

        if (req.file) {

            await cloudinary.uploader.destroy(productoEncontrado.public_id);

            updatedData.Imagen = req.file.path;
            updatedData.public_id = req.file.filename;
        }

        await productosModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        return res.status(200).json({
            message: "Producto actualizado"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Eliminar
productosController.deleteProducto = async (req, res) => {
    try {

        const productoEncontrado = await productosModel.findById(req.params.id);

        await cloudinary.uploader.destroy(productoEncontrado.public_id);

        await productosModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "Producto eliminado"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default productosController;