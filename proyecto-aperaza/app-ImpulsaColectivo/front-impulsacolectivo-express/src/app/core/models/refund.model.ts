import { Money, Status, Timestamps } from './api.model';

/** Tabla `refunds` — reembolso de un aporte */
export interface Refund extends Timestamps {
  id: number;
  amount: Money;
  reason: string;
  refund_date: string;
  contribution_id: number;
  status: Status;
}

export interface RefundPayload {
  amount: number;
  reason: string;
  refund_date: string;
  contribution_id: number;
  status?: Status;
}
