import { Status, Timestamps } from './api.model';

/** Tabla `roles`: ADMIN, PROMOTER, CONTRIBUTOR */
export interface Role extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  status: Status;
}

export interface RolePayload {
  name: string;
  description?: string | null;
  status?: Status;
}
