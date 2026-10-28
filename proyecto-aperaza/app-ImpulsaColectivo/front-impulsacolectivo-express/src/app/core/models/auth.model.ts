import { HttpMethod } from './resource.model';

/** Respuesta de POST /api/sesion/login (se consume en ISS-08). */
export interface SessionTokens {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

/** Un elemento de GET /api/permisos (se consume en ISS-08/09). */
export interface EffectivePermission {
  resource_id: number;
  method: HttpMethod;
  path: string;
  description: string | null;
  role_id: number;
  role_name: string;
}
