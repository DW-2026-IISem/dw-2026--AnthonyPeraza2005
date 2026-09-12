import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class ContributorNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Aportante', id);
  }
}
