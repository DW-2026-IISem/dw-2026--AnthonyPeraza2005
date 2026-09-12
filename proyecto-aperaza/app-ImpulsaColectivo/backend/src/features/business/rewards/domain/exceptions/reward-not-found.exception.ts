import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class RewardNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Recompensa', id);
  }
}
