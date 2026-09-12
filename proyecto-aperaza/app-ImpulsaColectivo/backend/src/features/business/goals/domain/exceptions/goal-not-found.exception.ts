import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class GoalNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Meta', id);
  }
}
