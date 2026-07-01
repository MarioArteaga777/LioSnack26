import cuentasPCFormModel from "../models/cuentasporCobrar.js"; // Ruta a tu modelo de Cuentas por Cobrar

const cuentasPCController = {};

// SELECT - Obtener todas las cuentas por cobrar
cuentasPCController.getAllCuentasPC = async (req, res) => {
  try {
    const cuentas = await cuentasPCFormModel.find();
    return res.status(200).json(cuentas);
  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


cuentasPCController.insertCuentaPC = async (req, res) => {
  try {
    // Solicitamos los datos que vienen del formulario
    const { 
      fecha_factura, 
      cliente, 
      sku_descripcion, 
      fecha_vencimiento, 
      monto_facturado, 
      abono, 
      forma_cobro, 
      notas 
    } = req.body;

    // Llenar el modelo de datos
    const newCuentaPC = new cuentasPCFormModel({
      fecha_factura,
      cliente,
      sku_descripcion,
      fecha_vencimiento,
      monto_facturado,
      abono,
      forma_cobro,
      notas
    });

    // Guardamos en la base de datos
    await newCuentaPC.save();
    
    return res.status(200).json({ message: "Cuenta por cobrar guardada exitosamente" });

  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ELIMINAR - Borrar una cuenta por cobrar por ID
cuentasPCController.deleteCuentaPC = async (req, res) => {
  try {
    await cuentasPCFormModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Cuenta por cobrar eliminada exitosamente" });
  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ACTUALIZAR - Modificar los datos de una cuenta por cobrar existente
cuentasPCController.updateCuentaPC = async (req, res) => {
  try {
    // Solicito los nuevos datos del formulario
    const { 
      fecha_factura, 
      cliente, 
      sku_descripcion, 
      fecha_vencimiento, 
      monto_facturado, 
      abono, 
      forma_cobro, 
      notas 
    } = req.body;

    const updatedData = {
      fecha_factura,
      cliente,
      sku_descripcion,
      fecha_vencimiento,
      monto_facturado,
      abono,
      forma_cobro,
      notas
    };

    // Guardamos todo lo actualizado en la base de datos
    await cuentasPCFormModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res.status(200).json({ message: "Cuenta por cobrar actualizada exitosamente" });
  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default cuentasPCController;