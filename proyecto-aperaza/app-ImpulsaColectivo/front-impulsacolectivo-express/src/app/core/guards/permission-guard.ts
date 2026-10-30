import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

/**
 * ¿Qué puedes hacer? El permiso se declara en la ruta:
 *
 *   data: { permission: 'GET /api/metas' }
 *
 * Es una ayuda visual: Express vuelve a validar cada petición con `authorize`
 * y responde 403 aunque alguien fuerce la URL o el DOM.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (!session.authEnabled) {
    return true;
  }

  const permission = route.data?.['permission'] as string | undefined;
  if (!permission || session.canPermission(permission)) {
    return true;
  }

  return router.createUrlTree(['/sin-permiso'], { queryParams: { permission } });
};
