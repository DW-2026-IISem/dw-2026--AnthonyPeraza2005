import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

/**
 * Deja pasar solo con sesión abierta.
 *
 * Sin sesión redirige a `/login` y guarda en `returnUrl` la pantalla que se
 * pedía, para volver a ella después de iniciar sesión.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (!session.authEnabled || session.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
