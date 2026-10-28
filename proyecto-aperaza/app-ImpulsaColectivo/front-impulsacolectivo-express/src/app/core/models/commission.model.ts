import { Money, Status, Timestamps } from './api.model';

/** Tabla `commissions` — comisión de la plataforma sobre una transacción */
export interface Commission extends Timestamps {
  id: number;
  percentage: Money; // DECIMAL(5,2)
  amount: Money;
  calculation_date: string;
  payment_transaction_id: number;
  status: Status;
}

export interface CommissionPayload {
  percentage: number;
  amount: number;
  calculation_date: string;
  payment_transaction_id: number;
  status?: Status;
}
