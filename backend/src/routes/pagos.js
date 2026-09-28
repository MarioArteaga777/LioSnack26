import { Router } from "express";
import paymentController from "../controller/paymentController.js";

const router = Router();

/**
 * Rutas para procesamiento de pagos con Wompi
 */

// POST - Procesar pago
// Endpoint: POST /api/pagos/procesar
// Body: { email, phone, fullName, amount, description, items, reference, cardLast4 }
router.post("/procesar", paymentController.processPayment);

// GET - Obtener estado de una transacción
// Endpoint: GET /api/pagos/estado/:transactionId
router.get("/estado/:transactionId", paymentController.getTransactionStatus);

// POST - Webhook de Wompi
// Endpoint: POST /api/pagos/webhook
router.post("/webhook", paymentController.wompiWebhook);

export default router;
