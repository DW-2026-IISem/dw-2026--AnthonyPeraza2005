import { Status, Timestamps } from './api.model';

/** Tabla `contributors` */
export interface Contributor extends Timestamps {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: Status;
}

export interface ContributorPayload {
  name: string;
  email: string;
  phone?: string | null;
  status?: Status;
}
