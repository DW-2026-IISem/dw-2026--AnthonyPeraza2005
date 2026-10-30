import { EffectivePermission } from '../models/auth.model';
import { HttpMethod } from '../models/resource.model';
import { User } from '../models/user.model';
import { SessionStore } from '../services/session-store';

const USUARIO_PRUEBA = {
  id: 99,
  username: 'tester',
  email: 'tester@impulsacolectivo.local',
  avatar: null,
  status: 'active',
} as User;

/** Recursos del negocio, con la ruta que usa el backend. */
const RECURSOS = [
  'promotores',
  'contribuyentes',
  'proyectos',
  'contribuciones',
  'transacciones-pago',
  'comisiones',
  'reembolsos',
  'recompensas',
  'metas',
  'desembolsos',
  'auditorias-proyecto',
];

/**
 * Deja en la sesión solo los permisos indicados (formato `'GET /api/metas'`).
 * Sirve para probar cómo se comporta una pantalla con un rol limitado.
 */
export function grantAccess(session: SessionStore, ...permissions: string[]): void {
  const filas: EffectivePermission[] = permissions.map((texto, indice) => {
    const [method, path] = texto.split(' ');
    return {
      resource_id: indice + 1,
      method: method as HttpMethod,
      path,
      description: null,
      role_id: 1,
      role_name: 'ADMIN',
    };
  });

  session.setAccess({ user: USUARIO_PRUEBA, permissions: filas });
}

/** Una sesión con todos los permisos del negocio: lo que tiene `admin`. */
export function grantFullAccess(session: SessionStore): void {
  const permisos: string[] = [];

  for (const recurso of RECURSOS) {
    permisos.push(
      `GET /api/${recurso}`,
      `POST /api/${recurso}`,
      `GET /api/${recurso}/:id`,
      `PATCH /api/${recurso}/:id`,
      `PUT /api/${recurso}/:id`,
      `DELETE /api/${recurso}/:id`,
      `PATCH /api/${recurso}/:id/deactivate`,
    );
  }

  grantAccess(session, ...permisos);
}
