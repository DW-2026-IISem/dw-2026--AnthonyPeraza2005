/** Datos de entrada de `PUT /api/transacciones-pago/:id` (reemplazo total). */
export interface UpdatePaymentTransactionDto {
  reference: string;
  payment_method: string;
  amount: number;
  transaction_date: string;
  contribution_id: number;
  status: "active" | "inactive";
}
