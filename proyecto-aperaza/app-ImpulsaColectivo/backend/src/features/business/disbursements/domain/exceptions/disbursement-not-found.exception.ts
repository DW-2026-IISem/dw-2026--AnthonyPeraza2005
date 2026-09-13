import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class DisbursementNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Desembolso', id);
  }
}
