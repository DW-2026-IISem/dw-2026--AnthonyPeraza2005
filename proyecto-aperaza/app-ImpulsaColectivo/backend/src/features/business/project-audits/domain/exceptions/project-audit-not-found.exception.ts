import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class ProjectAuditNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Auditoría de proyecto', id);
  }
}
