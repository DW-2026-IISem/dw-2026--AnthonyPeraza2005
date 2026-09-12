import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class PaymentTransactionNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Transacción de pago', id);
  }
}
