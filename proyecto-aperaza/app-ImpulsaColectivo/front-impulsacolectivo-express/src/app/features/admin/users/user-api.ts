import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EffectivePermission, PermissionsPayload } from '../../../core/models/auth.model';
import { User, UserPayload } from '../../../core/models/user.model';
import { CrudApi } from '../../../core/services/crud-api';

/** /api/usuarios → { users } / { user } */
@Injectable({ providedIn: 'root' })
export class UserApi extends CrudApi<User, UserPayload> {
  constructor() {
    super('usuarios', 'users', 'user');
  }

  /** Permisos efectivos del usuario: la misma consulta que usa `authorize` en el backend. */
  permissions(id: number): Observable<EffectivePermission[]> {
    return this.http
      .get<PermissionsPayload>(`${this.base}/${id}/permisos`)
      .pipe(map((response) => response.permissions));
  }
}
