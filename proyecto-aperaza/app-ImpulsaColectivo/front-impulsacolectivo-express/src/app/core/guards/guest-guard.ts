import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

/**
 * Protege `/login`: quien ya tiene sesión (o no necesita ninguna) va al panel.
 */
export const guestGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (!session.authEnabled || session.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
