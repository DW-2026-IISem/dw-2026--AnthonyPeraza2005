import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class CommissionNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Comisión', id);
  }
}
