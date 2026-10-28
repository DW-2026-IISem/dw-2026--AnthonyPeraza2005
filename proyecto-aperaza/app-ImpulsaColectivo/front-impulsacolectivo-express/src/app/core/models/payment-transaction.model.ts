import { Money, Status, Timestamps } from './api.model';

/** Tabla `payment_transactions` — el pago que respalda un aporte */
export interface PaymentTransaction extends Timestamps {
  id: number;
  reference: string; // único
  payment_method: string;
  amount: Money;
  transaction_date: string;
  contribution_id: number;
  status: Status;
}

export interface PaymentTransactionPayload {
  reference: string;
  payment_method: string;
  amount: number;
  transaction_date: string;
  contribution_id: number;
  status?: Status;
}
