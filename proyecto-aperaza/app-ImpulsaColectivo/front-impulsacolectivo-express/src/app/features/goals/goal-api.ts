import { Injectable } from '@angular/core';
import { Goal, GoalPayload } from '../../core/models/goal.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/metas → { goals } / { goal } */
@Injectable({ providedIn: 'root' })
export class GoalApi extends CrudApi<Goal, GoalPayload> {
  constructor() {
    super('metas', 'goals', 'goal');
  }
}
