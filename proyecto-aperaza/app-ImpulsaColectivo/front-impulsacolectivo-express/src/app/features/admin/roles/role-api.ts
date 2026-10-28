import { Injectable } from '@angular/core';
import { Role, RolePayload } from '../../../core/models/role.model';
import { CrudApi } from '../../../core/services/crud-api';

/** /api/roles → { roles } / { role } */
@Injectable({ providedIn: 'root' })
export class RoleApi extends CrudApi<Role, RolePayload> {
  constructor() {
    super('roles', 'roles', 'role');
  }
}
