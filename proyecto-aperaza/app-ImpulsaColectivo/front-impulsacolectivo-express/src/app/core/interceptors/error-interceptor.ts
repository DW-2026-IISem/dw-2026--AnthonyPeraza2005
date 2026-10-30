import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';
import { toApiMessage } from '../utils/api-error';

/**
 * Avisa de los fallos de carga que el usuario no puede resolver solo.
 *
 * - Solo mira peticiones GET: guardar, desactivar y eliminar ya muestran su
 *   propio aviso en cada lista, y dos avisos por el mismo error serían ruido.
 * - El 401 no se avisa aquí: lo gestiona `authInterceptor` (refresh o login).
 * - El error siempre se vuelve a lanzar: cada pantalla decide qué mostrar.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && req.method === 'GET') {
        if (error.status === 0) {
          notify.error(
            'Sin conexión',
            'No se pudo contactar con el servidor. Revisa que el backend esté en marcha.',
          );
        } else if (error.status === 403) {
          notify.error('Sin permiso', 'Tu rol no permite consultar este recurso.');
        } else if (error.status >= 500) {
          notify.error('Error del servidor', toApiMessage(error));
        }
      }

      return throwError(() => error);
    }),
  );
};
