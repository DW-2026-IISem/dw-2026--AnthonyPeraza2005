import { Injectable } from '@angular/core';
import { ProjectAudit, ProjectAuditPayload } from '../../core/models/project-audit.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/auditorias-proyecto → { project_audits } / { project_audit } */
@Injectable({ providedIn: 'root' })
export class ProjectAuditApi extends CrudApi<ProjectAudit, ProjectAuditPayload> {
  constructor() {
    super('auditorias-proyecto', 'project_audits', 'project_audit');
  }
}
