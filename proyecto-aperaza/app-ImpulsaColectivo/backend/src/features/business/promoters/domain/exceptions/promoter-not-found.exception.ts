import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class PromoterNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Promotor', id);
  }
}
