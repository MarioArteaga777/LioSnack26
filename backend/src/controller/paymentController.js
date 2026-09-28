import pedidoModel from "../models/pedidos.js";

const paymentController = {};

/**
 * Procesa un pago a través de Wompi
 * Endpoint de prueba: https://sandbox.wompi.co/v1/transactions
 * 
 * IMPORTANTE: Para usar esto en producción, necesitas:
 * 1. Configurar las variables de entorno con tus claves de Wompi
 * 2. Usar el endpoint de producción: https://api.wompi.co/v1/transactions
 * 3. Implementar manejo de webhooks para confirmar pagos
 */
paymentController.processPayment = async (req, res) => {
  try {
    const {
      email,
      phone,
      fullName,
      amount, // en centavos
      description,
      items,
      reference,
      cardLast4,
    } = req.body;

    // Validar datos requeridos
    if (!email || !phone || !fullName || !amount || !items || !reference) {
      return res.status(400).json({
        message: "Faltan datos requeridos para procesar el pago",
        ok: false,
      });
    }

    // En ambiente de prueba (SANDBOX), usamos credenciales de prueba
    // Para producción, usar variables de entorno
    const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY || "prv_test_"; // Placeholder
    const WOMPI_API_URL = "https://sandbox.wompi.co/v1";

    // Preparar datos para Wompi
    const wompiPayload = {
      amount_in_cents: amount,
      currency: "COP",
      customer_email: email,
      customer_phone: phone,
      reference: reference,
      description: description,
      payment_method: {
        type: "CARD",
        installments: 1,
      },
      // En producción, usarías un token de tarjeta tokenizado
      // Por ahora, esto es una simulación para el ambiente de prueba
      redirect_url: process.env.WOMPI_REDIRECT_URL || "https://localhost:3000/payment-success",
    };

    console.log("Procesando pago con Wompi:", {
      reference,
      amount: amount / 100 + " COP",
      email,
      description,
    });

    // En un ambiente de prueba real, aquí harías la petición a Wompi
    // Para este ejemplo, simularemos una transacción exitosa
    
    // Crear la orden en la base de datos
    const newPedido = new pedidoModel({
      fecha_pedido: new Date(),
      cliente: fullName,
      punto_de_venta: "Mobile App",
      vendedor_asignado: "Sistema Automático",
      items: items.map((item) => ({
        sku: item.id || "UNKNOWN",
        producto: item.name,
        cantidad_solicitada: item.quantity,
        precio_unitario: item.price,
      })),
      total_pedido: amount / 100, // convertir de centavos a pesos
      estado_pedido: "Pendiente de Confirmación",
      observaciones: `Transacción Wompi: ${reference} | Últimos 4 dígitos: ${cardLast4}`,
    });

    await newPedido.save();

    // Simular respuesta exitosa de Wompi
    // En producción, deberías hacer la petición real a Wompi
    const wompiResponse = {
      id: `trans_${Date.now()}`,
      reference: reference,
      amount_in_cents: amount,
      currency: "COP",
      status: "PENDING", // En producción, este status vendría de Wompi
      customer_email: email,
      created_at: new Date().toISOString(),
      merchant_id: "test_merchant",
      description: description,
    };

    return res.status(200).json({
      ok: true,
      success: true,
      message: "Pago procesado exitosamente",
      transaction: wompiResponse,
      order: {
        id: newPedido._id,
        reference: reference,
        total: amount / 100,
        status: "Pendiente de Confirmación",
      },
    });
  } catch (error) {
    console.error("Error al procesar pago:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error al procesar el pago: " + error.message,
    });
  }
};

/**
 * Obtiene el estado de una transacción
 */
paymentController.getTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        message: "ID de transacción requerido",
        ok: false,
      });
    }

    // Aquí harías una petición real a Wompi para obtener el estado
    // Para este ejemplo, devolvemos una respuesta simulada
    return res.status(200).json({
      ok: true,
      transaction: {
        id: transactionId,
        status: "APPROVED",
        amount_in_cents: 50000,
        currency: "COP",
      },
    });
  } catch (error) {
    console.error("Error al obtener estado de transacción:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener el estado de la transacción",
    });
  }
};

/**
 * Webhook para Wompi - Procesa confirmaciones de pago
 * Esta ruta se configura en el panel de Wompi para recibir notificaciones
 */
paymentController.wompiWebhook = async (req, res) => {
  try {
    const { event, data } = req.body;

    console.log("Webhook de Wompi recibido:", event);

    if (event === "transaction.updated") {
      const { reference, status, id } = data;

      // Actualizar el estado de la orden en la base de datos
      const pedido = await pedidoModel.findOneAndUpdate(
        { observaciones: { $regex: reference } },
        {
          estado_pedido:
            status === "APPROVED"
              ? "Pagado"
              : status === "DECLINED"
                ? "Rechazado"
                : "Pendiente",
        },
        { new: true }
      );

      console.log(`Pedido ${reference} actualizado a estado: ${status}`);

      return res.status(200).json({ ok: true, message: "Webhook procesado" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error en webhook de Wompi:", error.message);
    return res.status(500).json({ ok: false, message: "Error en webhook" });
  }
};

export default paymentController;
