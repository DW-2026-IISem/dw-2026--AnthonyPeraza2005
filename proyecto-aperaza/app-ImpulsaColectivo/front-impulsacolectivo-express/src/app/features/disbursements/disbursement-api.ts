import { Injectable } from '@angular/core';
import { Disbursement, DisbursementPayload } from '../../core/models/disbursement.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/desembolsos → { disbursements } / { disbursement } */
@Injectable({ providedIn: 'root' })
export class DisbursementApi extends CrudApi<Disbursement, DisbursementPayload> {
  constructor() {
    super('desembolsos', 'disbursements', 'disbursement');
  }
}
