import { Status, Timestamps } from './api.model';

/** Tabla `promoters` — /api/promotores */
export interface Promoter extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  contact_email: string;
  contact_phone: string | null;
  status: Status;
}

export interface PromoterPayload {
  name: string;
  description?: string | null;
  contact_email: string;
  contact_phone?: string | null;
  status?: Status;
}
