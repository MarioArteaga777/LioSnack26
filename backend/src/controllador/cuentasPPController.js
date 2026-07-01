import cuentasPPFormModel from "../models/cuentasporPagar.js"; // Ruta a tu modelo de Cuentas por Pagar

const cuentasPPController = {};

// SELECT - Obtener todas las cuentas por pagar
cuentasPPController.getAllCuentasPP = async (req, res) => {
  try {
    const cuentas = await cuentasPPFormModel.find();
    return res.status(200).json(cuentas);
  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// INSERT - Registrar una nueva cuenta por pagar
cuentasPPController.insertCuentaPP = async (req, res) => {
  try {
    // Solicitamos los datos que vienen del formulario según la imagen
    const { 
      fecha_factura, 
      proveedor, 
      concepto_material, 
      monto_total, 
      pagos_realizados, 
      saldo_pendiente, 
      fecha_vencimiento, 
      dias_para_vencer, 
      estado, 
      forma_pago, 
      notas 
    } = req.body;

    // Llenar el modelo de datos
    const newCuentaPP = new cuentasPPFormModel({
      fecha_factura,
      proveedor,
      concepto_material,
      monto_total,
      pagos_realizados,
      saldo_pendiente,
      fecha_vencimiento,
      dias_para_vencer,
      estado,
      forma_pago,
      notas
    });

    // Guardamos en la base de datos
    await newCuentaPP.save();
    
    return res.status(200).json({ message: "Cuenta por pagar guardada exitosamente" });

  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ELIMINAR - Borrar una cuenta por pagar por ID
cuentasPPController.deleteCuentaPP = async (req, res) => {
  try {
    await cuentasPPFormModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Cuenta por pagar eliminada exitosamente" });
  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ACTUALIZAR - Modificar los datos de una cuenta por pagar existente
cuentasPPController.updateCuentaPP = async (req, res) => {
  try {
    // Solicito los nuevos datos del formulario
    const { 
      fecha_factura, 
      proveedor, 
      concepto_material, 
      monto_total, 
      pagos_realizados, 
      saldo_pendiente, 
      fecha_vencimiento, 
      dias_para_vencer, 
      estado, 
      forma_pago, 
      notas 
    } = req.body;

    const updatedData = {
      fecha_factura,
      proveedor,
      concepto_material,
      monto_total,
      pagos_realizados,
      saldo_pendiente,
      fecha_vencimiento,
      dias_para_vencer,
      estado,
      forma_pago,
      notas
    };

    // Guardamos todo lo actualizado en la base de datos
    await cuentasPPFormModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res.status(200).json({ message: "Cuenta por pagar actualizada exitosamente" });
  } catch (error) {
    console.log("error: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default cuentasPPController;