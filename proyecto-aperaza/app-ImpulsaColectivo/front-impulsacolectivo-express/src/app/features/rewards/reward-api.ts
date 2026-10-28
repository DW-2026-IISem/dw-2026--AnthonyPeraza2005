import { Injectable } from '@angular/core';
import { Reward, RewardPayload } from '../../core/models/reward.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/recompensas → { rewards } / { reward } */
@Injectable({ providedIn: 'root' })
export class RewardApi extends CrudApi<Reward, RewardPayload> {
  constructor() {
    super('recompensas', 'rewards', 'reward');
  }
}
