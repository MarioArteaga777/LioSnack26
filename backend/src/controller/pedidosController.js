import pedidoModel from "../models/pedidos.js"; 

const pedidoController = {};

// SELECT - Obtener todas las cuentas por cobrar
pedidoController.getAllPedidos = async (req, res) => {
  try {
    const pedidos = await pedidoModel.find();
    return res.status(200).json(pedidos);
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

pedidoController.insertPedido = async (req, res) => {
  try {
    // Solicitamos los datos que vienen del formulario
    const { 
      fecha_pedido, 
      cliente, 
      punto_de_venta, 
      vendedor_asignado, 
      items, 
      total_pedido, 
      estado_pedido, 
      observaciones 
    } = req.body;

    // Llenar el modelo de datos
    const newPedido = new pedidoModel({
      fecha_pedido,
      cliente,
      punto_de_venta,
      vendedor_asignado,
      items,
      total_pedido,
      estado_pedido,
      observaciones
    });

    // Guardamos en la base de datos
    await newPedido.save();
    
    return res.status(200).json({ message: "Pedido guardado exitosamente" });

  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ELIMINAR - Borrar una cuenta por cobrar por ID
pedidoController.deletePedido = async (req, res) => {
  try {
    await pedidoModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Pedido eliminado exitosamente" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ACTUALIZAR - Modificar los datos de una cuenta por cobrar existente
pedidoController.updatePedido = async (req, res) => {
  try {
    // Solicito los nuevos datos del formulario
    const { 
      fecha_pedido, 
      cliente, 
      punto_de_venta, 
      vendedor_asignado, 
      items, 
      total_pedido, 
      estado_pedido, 
      observaciones 
    } = req.body;

    const updatedData = {
      fecha_pedido,
      cliente,
      punto_de_venta,
      vendedor_asignado,
      items,
      total_pedido,
      estado_pedido,
      observaciones
    };

    // Guardamos todo lo actualizado en la base de datos
    await pedidoModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res.status(200).json({ message: "Pedido actualizado exitosamente" });
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default pedidoController;