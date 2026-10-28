import { Injectable } from '@angular/core';
import { Contribution, ContributionPayload } from '../../core/models/contribution.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/contribuciones → { contributions } / { contribution } */
@Injectable({ providedIn: 'root' })
export class ContributionApi extends CrudApi<Contribution, ContributionPayload> {
  constructor() {
    super('contribuciones', 'contributions', 'contribution');
  }
}
