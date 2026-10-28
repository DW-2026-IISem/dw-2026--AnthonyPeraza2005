import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleUser, RoleUserPayload } from '../../../core/models/role-user.model';
import { ReadCreateApi } from '../../../core/services/crud-api';

/**
 * /api/asignaciones-rol → { assignments } / { assignment }
 * La tabla es `role_users`, pero la envoltura NO se llama `role_users`.
 * Solo GET, POST, deactivate y reactivate: no se edita ni se borra.
 */
@Injectable({ providedIn: 'root' })
export class RoleUserApi extends ReadCreateApi<RoleUser, RoleUserPayload> {
  constructor() {
    super('asignaciones-rol', 'assignments', 'assignment');
  }

  /** Reactiva una asignación dada de baja. */
  reactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/reactivate`, {});
  }
}
