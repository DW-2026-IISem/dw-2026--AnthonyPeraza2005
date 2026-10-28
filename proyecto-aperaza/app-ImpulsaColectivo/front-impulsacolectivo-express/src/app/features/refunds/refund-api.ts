import { Injectable } from '@angular/core';
import { Refund, RefundPayload } from '../../core/models/refund.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/reembolsos → { refunds } / { refund } */
@Injectable({ providedIn: 'root' })
export class RefundApi extends CrudApi<Refund, RefundPayload> {
  constructor() {
    super('reembolsos', 'refunds', 'refund');
  }
}
