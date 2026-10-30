import { HttpMethod } from './resource.model';
import { User } from './user.model';

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

/** POST /api/sesion/login: `identifier` acepta username o email. */
export interface LoginRequest {
  identifier: string;
  password: string;
}

/** GET /api/sesion/perfil */
export interface ProfilePayload {
  user: User;
}

/** GET /api/permisos y GET /api/usuarios/:id/permisos */
export interface PermissionsPayload {
  permissions: EffectivePermission[];
}

/** Estado compuesto que mantiene SessionStore: perfil más permisos efectivos. */
export interface AccessPayload {
  user: User;
  permissions: EffectivePermission[];
}
