import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class RefundNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Devolución', id);
  }
}
