import { Observable, of } from 'rxjs';

/**
 * Pide una lista solo si el rol puede leerla.
 *
 * Una pantalla suele cargar listas de otros recursos solo para mostrar nombres
 * (por ejemplo, contribuyentes en la tabla de aportes). Si el rol no tiene ese
 * permiso, la petición terminaría en 403 y tumbaría toda la pantalla. Con esto
 * la lista llega vacía, sin tocar la red, y la pantalla usa su texto de reserva.
 */
export function whenAllowed<T>(allowed: boolean, source: Observable<T[]>): Observable<T[]> {
  return allowed ? source : of([]);
}
