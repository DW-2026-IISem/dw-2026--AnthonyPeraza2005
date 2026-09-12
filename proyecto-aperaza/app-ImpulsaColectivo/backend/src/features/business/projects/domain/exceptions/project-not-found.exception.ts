import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class ProjectNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Proyecto', id);
  }
}
