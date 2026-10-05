/** Datos de entrada de `POST /api/transacciones-pago`. */
export interface CreatePaymentTransactionDto {
  reference: string;
  payment_method: string;
  amount: number;
  transaction_date: string;
  contribution_id: number;
  status?: "active" | "inactive";
}
