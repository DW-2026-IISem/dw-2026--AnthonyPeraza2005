import { UpdatePaymentTransactionDto } from "./update-payment-transaction.dto";

/** Datos de entrada de `PATCH /api/transacciones-pago/:id` (actualización parcial). */
export type PatchPaymentTransactionDto = Partial<UpdatePaymentTransactionDto>;
