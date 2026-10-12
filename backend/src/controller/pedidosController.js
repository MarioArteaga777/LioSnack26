import pedidoModel from "../models/pedidos.js"; 

const pedidoController = {};

// SELECT - Obtener todas las cuentas por cobrar
pedidoController.getAllPedidos = async (req, res) => {
  try {
    const pedidos = await pedidoModel.find().select("-cliente_id -cliente_email");
    return res.status(200).json(pedidos);
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

pedidoController.getMyOrders = async (req, res) => {
  try {
    const ownershipFilters = [{ cliente_id: String(req.customer._id) }];
    if (req.customer.email) {
      ownershipFilters.push({ cliente_email: req.customer.email.toLowerCase() });
    }

    const pedidos = await pedidoModel
      .find({ $or: ownershipFilters })
      .sort({ fecha_pedido: -1, createdAt: -1 });

    return res.status(200).json(pedidos);
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

pedidoController.createMyOrder = async (req, res) => {
  try {
    const { items, total_pedido, direccion_entrega, telefono, metodo_pago, observaciones } = req.body;

    if (!Array.isArray(items) || items.length === 0 || !Number.isFinite(Number(total_pedido))) {
      return res.status(400).json({ message: "El pedido no contiene productos o un total válido" });
    }

    const newPedido = new pedidoModel({
      fecha_pedido: new Date(),
      cliente: `${req.customer.name || ""} ${req.customer.lastName || ""}`.trim(),
      cliente_id: String(req.customer._id),
      cliente_email: req.customer.email.toLowerCase(),
      punto_de_venta: "Tienda en línea",
      vendedor_asignado: "Web",
      items,
      total_pedido: Number(total_pedido),
      estado_pedido: "Pendiente",
      direccion_entrega,
      telefono,
      metodo_pago,
      observaciones,
    });

    await newPedido.save();

    return res.status(201).json({
      message: "Pedido guardado exitosamente",
      orderId: newPedido._id,
    });
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