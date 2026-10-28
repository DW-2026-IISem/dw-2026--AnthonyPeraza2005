import { Injectable } from '@angular/core';
import { Promoter, PromoterPayload } from '../../core/models/promoter.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/promotores → { promoters } / { promoter } */
@Injectable({ providedIn: 'root' })
export class PromoterApi extends CrudApi<Promoter, PromoterPayload> {
  constructor() {
    super('promotores', 'promoters', 'promoter');
  }
}
