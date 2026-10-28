import { Injectable } from '@angular/core';
import { Project, ProjectPayload } from '../../core/models/project.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/proyectos → { projects } / { project } */
@Injectable({ providedIn: 'root' })
export class ProjectApi extends CrudApi<Project, ProjectPayload> {
  constructor() {
    super('proyectos', 'projects', 'project');
  }
}
