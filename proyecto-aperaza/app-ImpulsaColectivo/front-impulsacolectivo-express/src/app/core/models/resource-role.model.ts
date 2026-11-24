import { HttpMethod } from './resource.model';
import { Status, Timestamps } from './api.model';

/** Pivote `resource_roles`: cada fila ES un permiso (rol + recurso) */
export interface ResourceRole extends Timestamps {
  id: number;
  resource_id: number;
  role_id: number;
  status: Status;
  role?: { id: number; name: string } | null;
  resource?: {
    id: number;
    method: HttpMethod;
    path: string;
    description: string | null;
  } | null;
}

export interface ResourceRolePayload {
  resource_id: number;
  role_id: number;
  status?: Status;
}

/** Resultado de guardar la matriz de un rol (`POST /api/concesiones-rol` con `resource_ids`). */
export interface ResourceRoleMatrixResult {
  role_id: number;
  activated: number;
  deactivated: number;
  total_active: number;
}
