import { Injectable } from '@angular/core';
import { Resource, ResourcePayload } from '../../../core/models/resource.model';
import { CrudApi } from '../../../core/services/crud-api';

/** /api/recursos → { resources } / { resource } */
@Injectable({ providedIn: 'root' })
export class ResourceApi extends CrudApi<Resource, ResourcePayload> {
  constructor() {
    super('recursos', 'resources', 'resource');
  }
}
