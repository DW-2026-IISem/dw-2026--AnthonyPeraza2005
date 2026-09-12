import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class ContributionNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Aporte', id);
  }
}
