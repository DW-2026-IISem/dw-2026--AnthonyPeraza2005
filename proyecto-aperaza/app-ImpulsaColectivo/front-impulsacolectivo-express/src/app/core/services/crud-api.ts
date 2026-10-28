import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Lectura, alta y baja lógica de un recurso REST de Express.
 *
 * Express responde envolturas: `{ promoters: [...] }` en listas y
 * `{ promoter: {...} }` en un elemento. La clave cambia por recurso, así que
 * cada servicio la declara una sola vez y el componente recibe `T` o `T[]`.
 *
 * T = forma de lectura, P = payload de escritura.
 */
export abstract class ReadCreateApi<T, P> {
  protected readonly http = inject(HttpClient);
  protected readonly base: string;

  protected constructor(
    route: string,
    protected readonly plural: string,
    protected readonly singular: string,
  ) {
    this.base = `${environment.apiUrl}/${route}`;
  }

  list(): Observable<T[]> {
    return this.http.get<Record<string, T[]>>(this.base).pipe(map((r) => r[this.plural]));
  }

  get(id: number): Observable<T> {
    return this.http
      .get<Record<string, T>>(`${this.base}/${id}`)
      .pipe(map((r) => r[this.singular]));
  }

  create(payload: P): Observable<T> {
    return this.http.post<Record<string, T>>(this.base, payload).pipe(map((r) => r[this.singular]));
  }

  /** Baja lógica: status = inactive. */
  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }
}

/**
 * CRUD completo: además de lo anterior, edita y borra.
 * Los pivotes `role_users` y `resource_roles` NO lo usan: su API no tiene
 * PUT, PATCH /:id ni DELETE (solo deactivate/reactivate).
 */
export abstract class CrudApi<T, P> extends ReadCreateApi<T, P> {
  /** PATCH /:id — actualización parcial (la que usa el formulario). */
  update(id: number, payload: Partial<P>): Observable<T> {
    return this.http
      .patch<Record<string, T>>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r[this.singular]));
  }

  /** PUT /:id — reemplazo completo. */
  replace(id: number, payload: P): Observable<T> {
    return this.http
      .put<Record<string, T>>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r[this.singular]));
  }

  /** Baja física: DELETE. */
  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
