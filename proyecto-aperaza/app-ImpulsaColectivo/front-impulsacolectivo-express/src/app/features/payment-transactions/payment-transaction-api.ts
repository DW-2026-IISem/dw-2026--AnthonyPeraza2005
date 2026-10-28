import { Injectable } from '@angular/core';
import {
  PaymentTransaction,
  PaymentTransactionPayload,
} from '../../core/models/payment-transaction.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/transacciones-pago → { payment_transactions } / { payment_transaction } */
@Injectable({ providedIn: 'root' })
export class PaymentTransactionApi extends CrudApi<PaymentTransaction, PaymentTransactionPayload> {
  constructor() {
    super('transacciones-pago', 'payment_transactions', 'payment_transaction');
  }
}
