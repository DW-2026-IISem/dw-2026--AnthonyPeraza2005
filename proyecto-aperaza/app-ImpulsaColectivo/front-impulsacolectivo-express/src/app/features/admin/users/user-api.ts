import { Injectable } from '@angular/core';
import { User, UserPayload } from '../../../core/models/user.model';
import { CrudApi } from '../../../core/services/crud-api';

/** /api/usuarios → { users } / { user } */
@Injectable({ providedIn: 'root' })
export class UserApi extends CrudApi<User, UserPayload> {
  constructor() {
    super('usuarios', 'users', 'user');
  }
}
