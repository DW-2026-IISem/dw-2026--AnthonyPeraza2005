import { PaymentTransaction, PaymentTransactionI } from "../payment-transaction.model";

/** Forma de un `PaymentTransaction` tal como sale por la API. */
export type PaymentTransactionResponseDto = PaymentTransactionI;

/** Mapea el modelo Sequelize a su DTO de respuesta. */
export function toPaymentTransactionResponse(
  paymentTransaction: PaymentTransaction
): PaymentTransactionResponseDto {
  return paymentTransaction.toJSON() as PaymentTransactionResponseDto;
}
