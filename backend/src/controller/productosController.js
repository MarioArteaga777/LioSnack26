import productosModel from "../models/productos.js";
import { v2 as cloudinary } from "cloudinary";

const productosController = {};

// Devuelve todos los productos registrados
productosController.getAllProductos = async (req, res) => {
    try {
        const productos = await productosModel.find();
        return res.status(200).json(productos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Busca un producto por su ID
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

// Crea un nuevo producto, la imagen se sube previamente a Cloudinary
productosController.insertProducto = async (req, res) => {
    try {
        console.log("=== INSERT PRODUCT ===");
        console.log("req.file:", req.file);
        console.log("req.body:", req.body);
        console.log("req.headers['content-type']:", req.headers['content-type']);

        const { Nombre, SKU, Precio } = req.body;

        if (!req.file) {
            console.log("ERROR: No file found in req.file");
            return res.status(400).json({
                message: "Error: La imagen es requerida"
            });
        }

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
        console.log("error:", error.message);
        return res.status(500).json({
            message: "Error al guardar la produccion",
            error: error.message
        });
    }
};

// Actualiza un producto; si llega una imagen nueva, reemplaza la anterior en Cloudinary
productosController.updateProducto = async (req, res) => {
    try {
        const { Nombre, SKU, Precio } = req.body;

        const productoEncontrado = await productosModel.findById(req.params.id);

        if (!productoEncontrado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

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
        console.log("error:", error.message);
        return res.status(500).json({
            message: "Error al actualizar el producto",
            error: error.message
        });
    }
};

// Elimina un producto junto con su imagen en Cloudinary
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