import { Money, Status, Timestamps } from './api.model';

/** Tabla `disbursements` — desembolso de fondos al promotor de un proyecto */
export interface Disbursement extends Timestamps {
  id: number;
  amount: Money;
  disbursement_date: string;
  method: string;
  project_id: number;
  status: Status;
}

export interface DisbursementPayload {
  amount: number;
  disbursement_date: string;
  method: string;
  project_id: number;
  status?: Status;
}
