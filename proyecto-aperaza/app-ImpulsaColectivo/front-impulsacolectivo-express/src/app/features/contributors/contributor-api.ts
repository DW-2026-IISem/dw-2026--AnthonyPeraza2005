import { Injectable } from '@angular/core';
import { Contributor, ContributorPayload } from '../../core/models/contributor.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/contribuyentes → { contributors } / { contributor } */
@Injectable({ providedIn: 'root' })
export class ContributorApi extends CrudApi<Contributor, ContributorPayload> {
  constructor() {
    super('contribuyentes', 'contributors', 'contributor');
  }
}
