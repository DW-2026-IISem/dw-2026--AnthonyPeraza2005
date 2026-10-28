import { Injectable } from '@angular/core';
import { Commission, CommissionPayload } from '../../core/models/commission.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/comisiones → { commissions } / { commission } */
@Injectable({ providedIn: 'root' })
export class CommissionApi extends CrudApi<Commission, CommissionPayload> {
  constructor() {
    super('comisiones', 'commissions', 'commission');
  }
}
